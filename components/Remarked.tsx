"use client";

import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const Remarked = ({ text }: { text: string }) => {
  // Use your existing regex to clean the Groq AI output
  let fixed = text
    .replace(/(?<!\\)frac\{/g, "\\frac{")
    .replace(/(?<!\\)vec\{/g, "\\vec{");
  // ... other replaces from your file

  // Detect if the content is likely math
  const isMath = fixed.includes("\\") || fixed.includes("$");

  if (isMath) {
    // Remove manual dollar signs as react-katex adds them
    const cleanMath = fixed.replace(/\$/g, "");
    return <InlineMath math={cleanMath} />;
  }

  return <span>{text}</span>;
};

export default Remarked;
