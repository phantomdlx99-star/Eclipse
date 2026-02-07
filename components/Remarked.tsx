"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const Remarked = ({ text }: { text: string }) => {
  // Pre-process text to handle common LaTeX escapes if needed
  let fixed = text
    .replace(/(?<!\\)frac\{/g, "\\frac{")
    .replace(/(?<!\\)vec\{/g, "\\vec{");

  return (
    <div className="markdown-content">
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
