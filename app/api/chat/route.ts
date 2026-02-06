import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    messages,
    system:
      "You are a helpful e-learning assistant for Gujarat Students. You should response in Gujarati Language. Use English language where needed. Be accurate at gujarati grammar.",
  });

  return result.toTextStreamResponse();
}
