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
        model: google("gemini-2.5-flash-lite"),
        schema: quizSchema,
        prompt: prompt,
      }),
    );
    return result.object;
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
      return rawJson.quizzes;
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
        model: google("gemini-2.5-flash-lite"),
        schema: flashcardSchema,
        prompt: prompt,
      }),
    );
    return result.object;
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
Your goal is to generate high-quality flashcards for revision.

CRITICAL FORMATTING RULES:
1. Return ONLY a valid JSON object.
2. All mathematical formulas, variables, and units MUST be wrapped in single dollar signs (e.g., $u^2$).
3. You MUST use DOUBLE BACKSLASHES for all LaTeX commands.
4. Language: Gujarati (with English terms in parentheses).

JSON STRUCTURE:
{
  "flashcards": [
    {
      "front": "Concept or Question",
      "back": ["Step 1 explanation", "Step 2 explanation", "Conclusion"]
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
      return rawJson.flashcards;
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
