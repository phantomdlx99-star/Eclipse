// Remarked.tsx
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";

const Remarked = ({ text }: { text: string }) => {
  // Regex to fix common "broken" LaTeX where backslashes were stripped
  const fixedText = text
    .replace(/(?<!\\)text\{/g, "\\text{") // Fixes text{ -> \text{
    .replace(/(?<!\\)frac\{/g, "\\frac{") // Fixes frac{ -> \frac{
    .replace(/(?<!\\)sqrt\{/g, "\\sqrt{") // Fixes sqrt{ -> \sqrt{
    .replace(/(?<!\\)theta/g, "\\theta") // Fixes theta -> \theta
    .replace(/rac\{/g, "\\frac{") // Catch-all for common 'rac' error
    .replace(/ext\{/g, "\\text{"); // Catch-all for common 'ext' error

  return (
    <div className="inline-block font-display text-white font-semibold text-xl">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {fixedText}
      </ReactMarkdown>
    </div>
  );
};

export default Remarked;
