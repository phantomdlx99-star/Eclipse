import QuizGenerator from "@/components/QuizGenerator";
import generateQuiz from "@/lib/actions/featuresActions";

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
        <QuizGenerator
          classId={classId}
          subjectId={subjectId}
          chapterId={chapterId}
        />
      );

    default:
      break;
  }
};

export default page;
