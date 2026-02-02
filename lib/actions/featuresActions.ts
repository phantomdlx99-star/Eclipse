"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectToDB } from "../mongodb";
import { QuizResult } from "../model/quizResult";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generateQuiz = async (
  topic: string,
  classId: string,
  subjectId: string,
) => {
  const history = await getQuizHistory();
  console.log(history);
  if (history.length > 12) redirect("/");

  const model = genAi.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `Generate a quiz about for ${classId} ${subjectId} ${topic}. 
    Return a JSON array of 5 objects. Each object must have:
    - "question": the question text
    - "options": an array of 4 possible answers
    - "answer": the correct answer from the options array
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return { error: "Failed to generate quiz." };
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
