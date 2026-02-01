import Loading from "@/app/loading";
import QuizGenerator from "@/components/QuizGenerator";
import generateQuiz from "@/lib/actions/featuresActions";
import Link from "next/link";
import { Suspense } from "react";

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
  const quiz = await generateQuiz(chapterId, classId, subjectId);
  console.log(quiz);
  switch (feature) {
    case "quiz-generator":
      return (
        <main className="w-full h-auto">
          <Suspense fallback={<Loading />}>
            <QuizGenerator
              classId={classId}
              subjectId={subjectId}
              chapterId={chapterId}
            />
          </Suspense>
        </main>
      );

    default:
      break;
  }
};

export default page;
