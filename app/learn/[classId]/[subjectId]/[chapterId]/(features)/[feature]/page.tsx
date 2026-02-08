import Loading from "@/app/loading";
import QuizGenerator from "@/components/QuizGenerator";
import Link from "next/link";
import { Suspense } from "react";
import Flashcards from "@/components/Flashcards";
import MindMap from "@/components/MindMap";

import { GSEB_CURRICULUM } from "@/lib/constant";

const page = async ({
  params,
}: {
  params: Promise<{
    classId: string;
    subjectId: string;
    chapterId: string;
    feature: string;
  }>;
}) => {
  const { classId, subjectId, chapterId, feature } = await params;

  // Find chapter title for better context
  const chapterTitle = GSEB_CURRICULUM.find((cls) => cls.id === classId)
    ?.subjects.find((sub) => sub.slug === subjectId)
    ?.chapters.find((ch) => ch.slug === chapterId)?.title;

  switch (feature) {
    case "quiz-generator":
      return (
        <main className="w-full h-auto">
          <Suspense fallback={<Loading />}>
            <QuizGenerator
              classId={classId}
              subjectId={subjectId}
              chapterId={chapterId}
              topic={chapterTitle}
            />
          </Suspense>
        </main>
      );

    case "flashcards":
      return (
        <main className="w-full h-auto">
          <Suspense fallback={<Loading />}>
            <Flashcards
              classId={classId}
              subjectId={subjectId}
              chapterId={chapterId}
              topic={chapterTitle}
            />
          </Suspense>
        </main>
      );
    case "mind-mapper":
      return (
        <main className="w-full h-auto">
          <Suspense fallback={<Loading />}>
            <MindMap
              classId={classId}
              subjectId={subjectId}
              chapterId={chapterId}
              topic={chapterTitle}
            />
          </Suspense>
        </main>
      );

    default:
      break;
  }
};

export default page;
