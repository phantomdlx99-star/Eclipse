"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const Remarked = ({ text, provider }: { text: string; provider?: string }) => {
  // Pre-process text to handle common LaTeX escapes if needed
  let fixed = text
    .replace(/(?<!\\)frac\{/g, "\\frac{")
    .replace(/(?<!\\)vec\{/g, "\\vec{")
    .replace(/(?<!\\)sqrt\{/g, "\\sqrt{")
    .replace(/(?<!\\)theta/g, "\\theta")
    .replace(/(?<!\\)pi/g, "\\pi")
    .replace(/(?<!\\)alpha/g, "\\alpha")
    .replace(/(?<!\\)beta/g, "\\beta");

  return (
    <div className="markdown-content relative group">
      {provider && (
        <span className="absolute -top-4 right-0 text-[10px] font-bold uppercase tracking-tighter text-primary/30 group-hover:text-primary/60 transition-colors pointer-events-none">
          {provider}
        </span>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <span className="inline-block">{children}</span>,
        }}
      >
        {fixed}
      </ReactMarkdown>
    </div>
  );
};

export default Remarked;
