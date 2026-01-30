// components/QuizGenerator.tsx
"use client";
import generateQuiz from "@/lib/actions/featuresActions";
import React, { useRef, useState } from "react";

export default function QuizGenerator({ classId, subjectId, chapterId }: any) {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<any[] | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});

  // This would typically call your Gemini API Server Action
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const quiz = await generateQuiz(chapterId, classId, subjectId);
      setQuiz(quiz);
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

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            AI Quiz Generator
          </h1>
          <p className="text-gray-400">
            Generating custom questions for {subjectId} - {chapterId}
          </p>
        </header>
        {!quiz ? (
          <div className="glass-nav p-10 rounded-3xl border border-white/10 text-center animate-float">
            <h2 className="text-2xl mb-6 ubuntu-medium">
              Ready to test your knowledge?
            </h2>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-primary hover:scale-105 transition-transform text-black font-bold py-3 px-8 rounded-full disabled:opacity-50"
            >
              {loading ? "AI is thinking..." : "Generate Quiz Now"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {quiz.map((q, qIdx) => (
              <div
                key={qIdx}
                className="glass-nav p-6 rounded-2xl border border-white/10"
              >
                <p className="text-xl mb-4 font-display">
                  Q{qIdx + 1}: {q.question}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className={`text-left p-4 rounded-xl border border-white/5 transition-all ${bgColor} ${!hasAnswered && "hover:bg-primary/20 hover:border-primary/50"}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
