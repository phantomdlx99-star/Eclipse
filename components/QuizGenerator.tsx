// components/QuizGenerator.tsx
"use client";
import generateQuiz, { getQuizHistory } from "@/lib/actions/featuresActions";
import { useState } from "react";
import { saveQuizResult } from "@/lib/actions/featuresActions";
import { toast } from "sonner";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Import the math styles
import Remarked from "./Remarked";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Quiz = {
  question: string;
  options: string[];
  answer: string;
};

export default function QuizGenerator({ classId, subjectId, chapterId }: any) {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [value, setValue] = useState("5");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateQuiz(chapterId, classId, subjectId, value);

      // Error Handling: Use a guard to check if the response is an error
      if (data && "error" in data) {
        toast.error(data.error);
      } else {
        setQuiz(data);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSelect = (questionIdx: number, option: string) => {
    // Prevent changing answer once selected
    if (selectedAnswers[questionIdx]) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: option,
    }));
  };

  const totalQuestions = quiz?.length || 0;

  const answeredCount = Object.keys(selectedAnswers).length;

  const correctCount = Array.isArray(quiz)
    ? quiz?.reduce((acc, q, idx) => {
        return selectedAnswers[idx] === q.answer ? acc + 1 : acc;
      }, 0)
    : 0;

  const isFinished = totalQuestions > 0 && answeredCount === totalQuestions;

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const resultData = {
      subjectId,
      chapterId,
      score: correctCount,
      totalQuestions,
      answers: quiz?.map((q, i) => ({
        question: q.question, // Matches schema
        selected: selectedAnswers[i], // Matches schema
        correct: q.answer, // Matches schema
      })),
    };

    console.log(resultData.answers);

    try {
      await saveQuizResult(resultData);
      setSaved(true);
      return toast.success("Quiz Successfully saved", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error saving:", error);
      return toast.error("Error while saving the quiz", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center flex flex-col px-5 py-3 rounded-xl justify-center items-center gap-5 w-full h-auto border-2 border-primary">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            AI Quiz Generator
          </h1>
          <p className="text-gray-400">
            Generating custom questions for {subjectId} - {chapterId}
          </p>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Number of Quiz generation</SelectLabel>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </header>
        {!quiz ? (
          <div className="glass-nav p-10 rounded-3xl border border-white/10 text-center animate-float">
            <h2 className="text-2xl mb-6 ubuntu-medium">
              Ready to test your knowledge?
            </h2>
            <div className="flex justify-center gap-5">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-primary hover:scale-105 transition-transform text-black font-bold py-3 px-8 rounded-full disabled:opacity-50"
              >
                {loading ? "AI is thinking..." : "Generate Quiz Now"}
              </button>
              <Link href={`/quiz-generator`}>
                <button className="bg-primary hover:scale-105 transition-transform text-black font-bold py-3 px-8 rounded-full disabled:opacity-50">
                  See previous Quiz
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {quiz?.map((q: any, qIdx) => (
              <div
                key={qIdx}
                className="glass-nav p-6 rounded-2xl border border-white/10"
              >
                <div className="flex justify-start gap-2">
                  <h1 className="text-xl font-display text-white font-semibold">
                    {qIdx + 1}.
                  </h1>
                  <Remarked text={q.question} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  {q.options.map((opt: string) => {
                    const isSelected = selectedAnswers[qIdx] === opt;
                    const isCorrect = opt === q.answer;
                    const hasAnswered = !!selectedAnswers[qIdx];

                    // Determine background color based on state
                    let bgColor = "bg-white/5";
                    if (isSelected) {
                      bgColor = isCorrect ? "bg-green-600" : "bg-red-600";
                    } else if (hasAnswered && isCorrect) {
                      bgColor = "bg-green-600/50"; // Show correct answer if user was wrong
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelect(qIdx, opt)}
                        disabled={hasAnswered}
                        className={`text-left p-4 rounded-xl border border-white/5 transition-all font-display ${bgColor} ${!hasAnswered && "hover:bg-primary/20 hover:border-primary/50 font-display cursor-pointer text-lg"}`}
                      >
                        <Remarked text={opt} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        {isFinished && (
          <div className="glass-nav p-8 rounded-3xl border border-primary/30 text-center mb-10 animate-in fade-in zoom-in duration-500 mt-6 relative before:content-[''] before:absolute before:-top-5 before:-right-5 overflow-hidden before:w-20 before:h-20 before:bg-primary before:rounded-full z-4">
            <h2 className="text-3xl font-bold gradient-text mb-2 font-display">
              Quiz Complete!
            </h2>
            <p className="text-gray-300 mb-6 ubuntu-medium">
              You scored{" "}
              <span className="text-primary text-2xl">{correctCount}</span> out
              of {totalQuestions}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-white/10 hover:bg-white/20 border border-white/10 py-2 px-6 rounded-full transition-all"
              >
                Try Again
              </button>
              <button
                className={`bg-primary text-black font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform ${saved ? "cursor-not-allowed opacity-90" : ""}`}
                onClick={handleSave}
                disabled={saved}
              >
                Save Progress
              </button>
              <Link href={`/quiz-generator`}>
                <button className="bg-primary hover:scale-105 transition-transform text-black font-bold py-3 px-8 rounded-full disabled:opacity-50">
                  See previous Quiz
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
