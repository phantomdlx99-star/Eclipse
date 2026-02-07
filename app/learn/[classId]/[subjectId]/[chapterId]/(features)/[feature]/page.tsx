import Loading from "@/app/loading";
import QuizGenerator from "@/components/QuizGenerator";
// import generateQuiz from "@/lib/actions/featuresActions"; // Not used in page.tsx directly anymore? Wait, looking at original file it was imported but maybe unused in the snippet I saw?
// Actually, let's look at the original file content from ViewFile (Step 6).
// It imported generateQuiz but didn't seem to use it in the page component itself (it was passed to QuizGenerator but QuizGenerator imports it?? No, QuizGenerator uses it internally).
// Wait, the original file imported it: `import generateQuiz from "@/lib/actions/featuresActions";`
// But the page component is:
/*
const page = async ({ ... }) => { ... switch(feature) ... return <QuizGenerator ... /> }
*/
// It doesn't look like `generateQuiz` is used in the page component. It might have been there from a previous version.
// However, I should restore what was there to be safe, plus Flashcards.
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
