"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown"; // Import Markdown
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import remarkGfm from "remark-gfm";

export default function Page() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Create a ref for the bottom of the chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 2. Scroll function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 3. Trigger scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Placeholder for AI
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantText += decoder.decode(value);

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = assistantText;
          return updated;
        });
      }
    } catch (err) {
      console.error("Error streaming:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-dvh flex flex-col bg-slate-900 text-white p-5 md:p-10">
      {/* Scrollable container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-5 pr-2 custom-scrollbar">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex text-xl ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-4 rounded-2xl max-w-[85%] shadow-lg ${
                m.role === "user"
                  ? "bg-green-600 rounded-br-none font-display"
                  : "bg-slate-800 rounded-bl-none border anek-gujarati tracking-wider text-xl border-slate-700"
              }`}
            >
              {/* 4. Use ReactMarkdown to render content */}
              <div className="prose prose-invert max-w-none text-xl md:text-xl">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {/* 5. Invisible element to anchor the scroll */}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none text-white focus-visible:ring-0 text-lg"
          placeholder="Type your message..."
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:scale-105 transition"
        >
          {loading ? "..." : "Send"}
        </Button>
      </form>
    </main>
  );
}
