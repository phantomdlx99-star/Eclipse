"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import Groq from "groq-sdk";
import { generateObject } from "ai";
import { z } from "zod";
import { connectToDB } from "../mongodb";
import { QuizResult } from "../model/quizResult";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
/**
 * Helper to handle retries with exponential backoff
 */
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
    Return a JSON array of ${value} objects in Gujarati Language. Use English wherever its needed to generate the quiz. Each object must have a "question", 
    an array of 4 "options", and the correct "answer" string. Always return mathematical formulas, variables, and scientific notation wrapped in LaTeX dollar signs, e.g., $u^2$ or $\sin(2\theta)$.`;

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
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a quiz generator. 
        Return ONLY a JSON object. 
        All math formulas MUST be wrapped in single dollar signs (e.g., $E=mc^2$). 
        Do NOT repeat formulas in plain text.
        Structure: { "quizzes": [{ "question": "string", "options": ["string"], "answer": "string" }] }`,
          },
          {
            role: "user",
            content: prompt,
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
