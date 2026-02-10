import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  // 1. Create the completion with stream: true
  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant responding in Gujarati. Response the Maths equations in mathjax format. For example: $E=mc^2$ All mathematical formulas, variables, and units MUST be wrapped in single dollar signs (e.g., $u^2$). You MUST use DOUBLE BACKSLASHES for all LaTeX commands so they survive JSON parsing. - WRONG: \text{kg} or \frac{1}{2} - RIGHT: \\text{kg} or \\frac{1}{2} DO NOT provide a plain-text fallback or repeat the formula outside of the dollar signs. Language: Provide the question and options in Gujarati. Use English terms in parentheses if they are common technical terms.`,
      },
      ...messages,
    ],
    stream: true,
  });

  // 2. Convert the Groq stream into a standard Web ReadableStream
  const responseStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(new TextEncoder().encode(content));
      }
      controller.close();
    },
  });

  return new Response(responseStream);
}
