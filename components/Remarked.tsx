"use client";

import ReactMarkdown from "react-markdown";
import { MathJax } from "better-react-mathjax";

const Remarked = ({ text, provider }: { text: string; provider?: string }) => {
  return (
    <div className="markdown-content relative group w-full">
      {provider && (
        <span className="absolute -top-6 right-0 text-[10px] font-bold opacity-40 uppercase tracking-tighter">
          {provider}
        </span>
      )}
      <MathJax dynamic hideUntilTypeset={"first"}>
        <div className="math-container">
          <ReactMarkdown
            components={{
              // Using a div instead of a span to avoid inline-block clipping
              p: ({ children }) => (
                <div className="m-0 leading-[1.8] py-2">{children}</div>
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
      </MathJax>
    </div>
  );
};

export default Remarked;
