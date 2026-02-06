// Remarked.tsx
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";

const Remarked = ({ text }: { text: string }) => {
  return (
    <div className="inline-block font-display text-white font-semibold text-xl">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default Remarked;
