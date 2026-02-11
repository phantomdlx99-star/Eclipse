"use server";

import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { redirect } from "next/navigation";

export async function generateTimeTable(prompt: string) {
  const { userId, has } = await auth();
  if (!userId) return;

  if (!has({ plan: "pro_version" })) redirect("/pricing");

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a helpful educational assistant. Your goal is to create a comprehensive weekly study timetable based on the user's needs. 
          
          For each day of the week, provide a detailed schedule with specific time spans, subjects, and topics to cover for a full week.
          
          Generate the response in the following exact JSON format:
          {
            "timetable": [
                {
                  "day": "Monday",
                  "schedule": [
                    {
                      "time": "09:00 AM - 10:30 AM",
                      "subject": "Mathematics",
                      "topic": "Introduction to Trigonometry and Basic Identities"
                    },
                    {
                      "time": "11:00 AM - 12:30 PM",
                      "subject": "Physics",
                      "topic": "Newton's Laws of Motion - Theory"
                    }
                  ]
                }
            ],
            "description": "A brief overview and strategic advice for this weekly study plan."
          }

          INSTRUCTIONS:
          1. Ensure you cover all 7 days of the week (Monday to Sunday).
          2. Use "Revision" or "Rest" for days as appropriate if not specified.
          3. Make the topics specific, actionable, and suitable for the student's level.
          4. Each object in the "timetable" array must have a "day" string and a "schedule" array.
          5. Return ONLY the JSON object.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) return null;

    return JSON.parse(content);
  } catch (error) {
    console.error(error);
    return null;
  }
}
