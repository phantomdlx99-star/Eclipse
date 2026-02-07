"use client";

import { useState } from "react";
import { generateFlashcards } from "@/lib/actions/featuresActions";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import Remarked from "./Remarked";

type Flashcard = {
  front: string;
  back: string[];
};

export default function Flashcards({
  classId,
  subjectId,
  chapterId,
  topic: initialTopic,
}: any) {
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setFlashcards(null);
    setCurrentIndex(0);
    setIsFlipped(false);

    try {
      const topic = initialTopic || chapterId;
      const data = await generateFlashcards(topic, classId, subjectId);

      if (data && "error" in data) {
        toast.error(data.error as string);
      } else {
        setFlashcards(data as Flashcard[]);
      }
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast.error("Failed to generate flashcards");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!flashcards) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 200);
  };

  const handlePrev = () => {
    if (!flashcards) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + flashcards.length) % flashcards.length,
      );
    }, 200);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen p-8 text-white flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <header className="mb-10 text-center flex flex-col px-5 py-3 rounded-xl justify-center items-center gap-5 w-full h-auto border-2 border-primary">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            AI Flashcards
          </h1>
          <p className="text-gray-400">
            Master {subjectId} - {chapterId} concepts with active recall
          </p>
        </header>

        {!flashcards ? (
          <div className="glass-nav p-10 rounded-3xl border border-white/10 text-center animate-float flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl mb-6 ubuntu-medium">
              Ready to memorize key concepts?
            </h2>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-primary hover:scale-105 transition-transform text-black font-bold py-3 px-8 rounded-full disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RotateCw className="animate-spin w-5 h-5" />
                  Creating Flashcards...
                </>
              ) : (
                "Generate Flashcards"
              )}
            </button>
            {loading && (
              <p className="mt-4 text-gray-400 text-sm animate-pulse">
                This might take a few seconds...
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            {/* 3D Card Container */}
            <div
              className="relative w-full max-w-3xl h-[480px] perspective-1000 cursor-pointer group"
              onClick={handleFlip}
            >
              <div
                className={`relative w-full h-full transition-all duration-500 transform-style-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden">
                  <div className="glass-nav w-full h-full rounded-3xl border border-white/10 p-10 flex flex-col items-center justify-center text-center shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] hover:border-primary/50 transition-colors">
                    <span className="absolute top-6 left-6 text-xs text-primary/80 uppercase tracking-widest font-bold">
                      Question
                    </span>
                    <div className="prose prose-invert prose-base lg:prose-lg max-w-none wrap-break-word leading-relaxed">
                      <Remarked text={flashcards[currentIndex].front} />
                    </div>
                    <span className="absolute bottom-6 text-sm text-gray-500 animate-pulse">
                      Click to flip
                    </span>
                  </div>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180">
                  <div className="glass-nav w-full h-full rounded-3xl border border-primary/30 bg-primary/5 p-10 flex flex-col items-center justify-start overflow-y-auto shadow-[0_0_50px_-12px_rgba(var(--primary),0.2)]">
                    <span className="mb-8 text-xs text-primary uppercase tracking-widest font-bold">
                      Step-by-Step Answer
                    </span>
                    <div className="w-full space-y-6 text-left">
                      {flashcards[currentIndex].back.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex gap-4 items-start animate-in slide-in-from-left duration-300"
                          style={{ animationDelay: `${sIdx * 100}ms` }}
                        >
                          <span className="shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-bold border border-primary/30">
                            {sIdx + 1}
                          </span>
                          <div className="prose prose-invert prose-base lg:prose-lg max-w-none wrap-break-word leading-relaxed">
                            <Remarked text={step} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
              <button
                onClick={handlePrev}
                className="p-4 rounded-full glass-nav hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <span className="text-xl font-mono text-gray-400">
                {currentIndex + 1} / {flashcards.length}
              </span>

              <button
                onClick={handleNext}
                className="p-4 rounded-full glass-nav hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
                aria-label="Next card"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={handleGenerate}
              className="mt-4 text-sm text-gray-500 hover:text-primary transition-colors flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Regenerate Set
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
