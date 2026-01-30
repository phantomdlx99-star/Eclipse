"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generateQuiz = async (
  topic: string,
  classId: string,
  subjectId: string,
) => {
  const model = genAi.getGenerativeModel({
    model: "gemini-2.5-flash",
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
