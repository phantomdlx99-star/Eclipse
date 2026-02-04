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
  const history = await getQuizHistory();
  if (history.length > 12) redirect("/");

  // Define the schema once to ensure both providers return identical JSON
  const quizSchema = z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      answer: z.string(), // Must be the correct text from the options array
    }),
  );
  const prompt = `Generate a quiz for ${classId} ${subjectId} ${topic}. 
Return a JSON array of ${value} objects.
CRITICAL: All math/variables must be wrapped in single dollar signs.
IMPORTANT: Use DOUBLE BACKSLASHES for all LaTeX commands. 
Example: Write \\\\frac{a}{b} (not \\frac) and \\\\theta (not \\theta).
This is necessary so the backslashes survive JSON parsing.`;

  try {
    // Attempt 1: Gemini with Exponential Backoff
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
