// components/QuizGenerator.tsx
"use client";
import generateQuiz, { getQuizHistory } from "@/lib/actions/featuresActions";
import { useState } from "react";
import { saveQuizResult } from "@/lib/actions/featuresActions";
import { toast } from "sonner";
import Link from "next/link";
import "katex/dist/katex.min.css"; // Import the math styles
import Remarked from "./Remarked";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Quiz = {
  question: string;
  options: string[];
  answer: string;
};

export default function QuizGenerator({
  classId,
  subjectId,
  chapterId,
  topic: initialTopic,
}: any) {
  const [issue, setIssue] = useState("");
  const [other, setOther] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [value, setValue] = useState("5");
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const topic = initialTopic || chapterId;
      const data = await generateQuiz(topic, classId, subjectId, value);

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
  console.log(quiz);

  const handleIssue = async (question: string) => {
    try {
      const issueToReport = issue === "other" ? other : issue;
      if (!issueToReport) {
        return toast.error("Please specify the issue");
      }

      const res = await axios.post("/api/issue", {
        question,
        issue: issueToReport,
      });

      if (res.data.error) {
        return toast.error(res.data.error);
      }

      setIssue("");
      setOther("");
      return toast.success(
        res.data.message || "Your issue is reported successfully!",
        {
          position: "top-center",
        },
      );
    } catch (error: any) {
      console.error("Error reporting issue:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to report issue. Please try again.";
      return toast.error(errorMessage, {
        position: "top-center",
      });
    }
  };

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
              <SelectValue placeholder="Number of questions" />
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
                className="glass-nav p-6 rounded-2xl border border-white/10 relative"
              >
                <div className="flex anek-gujarati text-2xl  justify-start gap-2 items-center ">
                  <h1 className="text-xl font-display text-white font-semibold">
                    {qIdx + 1}.
                  </h1>
                  <Remarked text={q.question} />
                </div>
                <Drawer>
                  <DrawerTrigger asChild>
                    <div className="absolute top-4 right-4 overflow-hidden rounded-full bg-transparent hover:bg-secondary p-2 cursor-pointer transition flex justify-center items-center">
                      <Flag size={20} />
                    </div>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm font-display">
                      <DrawerHeader>
                        <DrawerTitle className="text-3xl">Report</DrawerTitle>
                        <DrawerDescription>
                          Write the issues with the questions/answeres
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 pb-0">
                        <div className="flex items-center justify-center space-x-2">
                          <Select value={issue} onValueChange={setIssue}>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder="Select the issue"
                                className="font-bold text-text"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Select the issue</SelectLabel>
                                <SelectItem value="typo">
                                  Typing Error
                                </SelectItem>
                                <SelectItem value="wrong-answer">
                                  Wrong Answer
                                </SelectItem>
                                <SelectItem value="wrong-question">
                                  Wrong Question
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="h-[120px] flex items-center justify-center space-x-2">
                          {issue === "other" && (
                            <Input
                              placeholder="Enter the issue"
                              className="w-full"
                              value={other}
                              onChange={(e) => setOther(e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button onClick={() => handleIssue(q.question)}>
                            Submit
                          </Button>
                        </DrawerClose>
                        <DrawerClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>

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
                        className={`text-left w-full h-full p-4 rounded-xl border text-xl border-border transition-all font-display ${bgColor} ${!hasAnswered && "hover:bg-primary/20 hover:border-primary/50 font-display cursor-pointer anek-guajarti"}`}
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
