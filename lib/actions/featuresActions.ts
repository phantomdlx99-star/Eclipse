"use server";

import { google } from "@ai-sdk/google";
import Groq from "groq-sdk";
import { generateObject } from "ai";
import { z } from "zod";
import { connectToDB } from "../mongodb";
import { QuizResult } from "../model/quizResult";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 2000,
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (error.status === 429 && retries > 0) {
      console.warn(`Rate limited. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Normalizes LaTeX formatting from different AI providers.
 * Converts \( \) to $ and \[ \] to $$ for consistency.
 */
function normalizeLaTeX(text: string): string {
  if (typeof text !== "string") return text;

  return (
    text
      // 1. Convert various AI delimiters to standard $
      .replace(/\\{2,}\(/g, "$")
      .replace(/\\{2,}\)/g, "$")
      .replace(/\\{2,}\[/g, "$$")
      .replace(/\\{2,}\]/g, "$$")
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$")
      .replace(/\\\[/g, "$$")
      .replace(/\\\]/g, "$$")
      // Fix the weird single quote delimiter seen in your screenshot ($...$')
      .replace(/\$'/g, "$")

      // 2. Wrap bare physics terms in backslashes if they are inside $ blocks
      // This fixes "mu" -> "\mu", "times" -> "\times", etc.
      .replace(/(?<=[\$])\b(mu|theta|alpha|beta|pi|times|vec|hat)\b/g, "\\$1")

      // 3. Fix double backslashes that sometimes get tripled by JSON parsing
      .replace(/\\{3,}/g, "\\\\")
  );
}
/**
 * Recursively processes the AI response to normalize LaTeX and tag with provider.
 */
function processAIResponse(data: any, provider: "gemini" | "groq"): any {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => processAIResponse(item, provider));
  }

  if (typeof data === "object") {
    const processed: any = Array.isArray(data) ? [] : {};

    // If it's a "main" entity (question, flashcard, or mindmap node), add the provider
    if (data.question || data.front || data.label) {
      processed.provider = provider;
    }

    for (const key in data) {
      const value = data[key];
      if (typeof value === "string") {
        processed[key] = normalizeLaTeX(value);
      } else if (typeof value === "object" && value !== null) {
        processed[key] = processAIResponse(value, provider);
      } else {
        processed[key] = value;
      }
    }
    return processed;
  }

  if (typeof data === "string") {
    return normalizeLaTeX(data);
  }

  return data;
}

const generateQuiz = async (
  topic: string,
  classId: string,
  subjectId: string,
  value: string,
) => {
  const { has, userId } = await auth();
  const history = await getQuizHistory();

  const isPro = has({ plan: "pro_version" });
  if (!isPro && history.length >= 6) redirect("/limit");

  const quizSchema = z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      answer: z.string(),
    }),
  );
  const prompt = `Generate a quiz for ${classId} ${subjectId} ${topic}. 
Return a JSON array of ${value} objects in Gujarati Language. Use English where needed.
CRITICAL: All math/variables must be wrapped in single dollar signs.
IMPORTANT: Use DOUBLE BACKSLASHES for all LaTeX commands. 
Example: Write \\\\frac{a}{b} (not \\frac) and \\\\theta (not \\theta).
This is necessary so the backslashes survive JSON parsing.`;

  try {
    const result = await withRetry(() =>
      generateObject({
        model: google("gemini-1.5-flash"),
        schema: quizSchema,
        prompt: prompt,
      }),
    );
    return processAIResponse(result.object, "gemini");
  } catch (error: any) {
    console.error("Gemini failed, switching to Groq:", error.message);

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: `You are a professional physics and science educator. 
Your goal is to generate high-quality, accurate multiple-choice questions.

CRITICAL FORMATTING RULES:
1. Return ONLY a valid JSON object.
2. All mathematical formulas, variables, and units MUST be wrapped in single dollar signs (e.g., $u^2$).
3. You MUST use DOUBLE BACKSLASHES for all LaTeX commands so they survive JSON parsing.
   - WRONG: \text{kg} or \frac{1}{2}
   - RIGHT: \\text{kg} or \\frac{1}{2}
4. DO NOT provide a plain-text fallback or repeat the formula outside of the dollar signs.
5. Language: Provide the question and options in Gujarati. Use English terms in parentheses if they are common technical terms.

JSON STRUCTURE:
{
  "quizzes": [
    {
      "question": "Question text here with math like $v = u + at$",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The exact text of the correct option"
    }
  ]
}`,
          },
          {
            role: "user",
            content: `Generate a ${value}-question quiz for Class ${classId}, Subject: ${subjectId}, on the topic of "${topic}". Ensure questions are conceptually accurate and follow the formatting rules provided.`,
          },
        ],
        // Force Groq to return a JSON structure
        response_format: { type: "json_object" },
      });

      const rawJson = JSON.parse(completion.choices[0].message.content || "{}");
      return processAIResponse(rawJson.quizzes, "groq");
    } catch (fallbackError: any) {
      console.error("All providers failed:", fallbackError);
      return { error: "Failed to generate quiz after multiple attempts." };
    }
  }
};

export default generateQuiz;

export const generateFlashcards = async (
  topic: string,
  classId: string,
  subjectId: string,
) => {
  const { has } = await auth();

  // Optional: Add rate limiting or pro checks here if needed, similar to generateQuiz
  // const isPro = has({ plan: "pro_version" });

  const flashcardSchema = z.array(
    z.object({
      front: z.string(),
      back: z.array(z.string()),
    }),
  );

  const prompt = `Generate 10 flashcards for ${classId} ${subjectId} ${topic}.
Return a JSON array of objects with "front" (question/concept) and "back" (array of steps for the answer/explanation) in Gujarati Language. Use English where needed.
CRITICAL: The "back" field MUST be an array of strings, where each string is a logical step or part of the explanation.
Example: ["Step 1: ...", "Step 2: ...", "Final Answer: ..."]
CRITICAL: All math/variables must be wrapped in single dollar signs.
IMPORTANT: Use DOUBLE BACKSLASHES for all LaTeX commands.
Example: Write \\\\frac{a}{b} (not \\frac) and \\\\theta (not \\theta).
This is necessary so the backslashes survive JSON parsing.`;

  try {
    const result = await withRetry(() =>
      generateObject({
        model: google("gemini-1.5-flash"), // Corrected from gemini-2.5-flash-lite
        schema: flashcardSchema,
        prompt: prompt,
      }),
    );
    return processAIResponse(result.object, "gemini");
  } catch (error: any) {
    console.error("Gemini failed, switching to Groq:", error.message);

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: `You are an expert Physics and Mathematics educator specializing in the Gujarat State Board (GSEB) curriculum.

  PRIMARY DIRECTIVE:
  - All explanatory text and labels MUST be in the GUJARATI language.
  - Use English technical terms ONLY in parentheses following the Gujarati term, e.g., "પ્રવેગ (Acceleration)".
  - NEVER output text in Chinese, Hindi, or any language other than Gujarati and English.
            
MATHEMATICAL & LATEX FORMATTING:
1. DELIMITERS: Wrap ALL mathematical formulas, variables (like $x$, $y$, $v$), and units in single dollar signs: $...$.
2. JSON ESCAPING: You MUST use DOUBLE BACKSLASHES for all LaTeX commands so they survive JSON parsing.
   - CORRECT: \\frac{a}{b}, \\theta, \\vec{v}, \\hat{i}, \\mu
   - WRONG: \frac{a}{b}, \theta
3. NO PLAIN TEXT MATH: Do not write "mu" or "times". Write $\mu$ and $\times$ using LaTeX syntax: $\\mu$ and $\\times$.

RESPONSE STRUCTURE:
- Return ONLY a valid JSON object. 
- Ensure the "back" of flashcards is a detailed, logical array of steps.
- If a formula is the final answer, ensure it is clearly stated in its own step.

JSON STRUCTURE REFERENCE:
{
  "flashcards": [
    {
      "front": "Gujarati question here with $math$",
      "back": [
        "Step 1 in Gujarati with $math$",
        "Step 2 in Gujarati with $math$"
      ]
    }
  ]
}`,
          },
          {
            role: "user",
            content: `Generate 10 flashcards for Class ${classId}, Subject: ${subjectId}, on the topic of "${topic}". Ensure the "back" is a detailed step-by-step array.`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const rawJson = JSON.parse(completion.choices[0].message.content || "{}");
      console.log(rawJson);
      return processAIResponse(rawJson.flashcards, "groq");
    } catch (fallbackError: any) {
      console.error("All providers failed:", fallbackError);
      return {
        error: "Failed to generate flashcards after multiple attempts.",
      };
    }
  }
};

export async function saveQuizResult(data: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await connectToDB();

  const newResult = await QuizResult.create({
    clerkId: userId,
    ...data,
  });
  return JSON.parse(JSON.stringify(newResult));
}

export async function getQuizHistory() {
  const { userId } = await auth();
  if (!userId) return [];

  await connectToDB();
  const history = await QuizResult.find({ clerkId: userId }).sort({
    createdAt: -1,
  });
  return JSON.parse(JSON.stringify(history));
}

export async function getPrevQuizHistory(id: any) {
  const { userId } = await auth();
  if (!userId) return [];

  await connectToDB();
  const history = await QuizResult.findOne({
    clerkId: userId,
    _id: id,
  });
  console.log(history);
  return JSON.parse(JSON.stringify(history));
}

export const generateMindMap = async (
  chapterId: string,
  classId: string,
  subjectId: string,
  topic: string,
) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const nodeSchema: any = z.lazy(() =>
    z.object({
      label: z.string(),
      children: z.array(nodeSchema),
    }),
  );

  const mindMapSchema = z.object({
    root: nodeSchema,
  });

  try {
    const result = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: mindMapSchema,
      prompt: `Generate a detailed recursive mind map for the topic "${topic}" (Class: ${classId}, Subject: ${subjectId}). 
Return a JSON structure where "root" is the main topic, and "children" are sub-topics that can recursively have their own children.

CRITICAL RULES:
1. Language: EVERYTHING must be in Gujarati. English terms can be included in parentheses ONLY for technical terms.
2. Math Formatting: All mathematical formulas, variables, and units MUST be wrapped in single dollar signs (e.g., $v = u + at$).
3. LaTeX: Use DOUBLE BACKSLASHES for all LaTeX commands implies escaping them so they survive JSON parsing.
   - CORRECT: "\\\\frac{a}{b}", "\\\\theta", "\\\\vec{v}"
   - WRONG: "\\frac", "\\theta" (these will break)
4. Accuracy: Ensure the concepts are accurate for Class ${classId} ${subjectId}.`,
    });
    return processAIResponse(result.object, "gemini");
  } catch (error: any) {
    console.error("Gemini Mindmap failed, switching to Groq:", error.message);
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: `You are a professional physics and science educator.
Your goal is to generate high-quality, recursive Mind Maps for revision.

CRITICAL FORMATTING RULES:
1. Return ONLY a valid JSON object.
2. All mathematical formulas, variables, and units MUST be wrapped in single dollar signs (e.g., $u^2$).
3. You MUST use DOUBLE BACKSLASHES for all LaTeX commands.
4. Language: Gujarati (with English terms in parentheses).

JSON STRUCTURE:
{
  "root": {
    "label": "Main Topic",
    "children": [
      {
        "label": "Sub-topic 1",
        "children": [
          { "label": "Detail 1", "children": [] }
        ]
      }
    ]
  }
}`,
          },
          {
            role: "user",
            content: `Generate a detailed recursive Mind Map for the topic "${topic}" (Class ${classId}, Subject: ${subjectId}).`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const rawJson = JSON.parse(completion.choices[0].message.content || "{}");
      return processAIResponse(rawJson, "groq");
    } catch (error) {
      console.error("All providers failed:", error);
      return {
        error: "Failed to generate Mind Map after multiple attempts.",
      };
    }
  }
};
