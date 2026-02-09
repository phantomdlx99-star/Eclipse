"use client";

import ReactMarkdown from "react-markdown";
import { MathJax } from "better-react-mathjax";

const Remarked = ({ text, provider }: { text: string; provider?: string }) => {
  return (
    <div className="markdown-content relative group">
      {provider && (
        <span className="absolute -top-4 right-0 text-[10px] font-bold ...">
          {provider}
        </span>
      )}
      {/* Set dynamic to true and ensure typesetting is forced on every update */}
      <MathJax dynamic hideUntilTypeset={"first"}>
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <span className="inline-block">{children}</span>
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </MathJax>
    </div>
  );
};

export default Remarked;
