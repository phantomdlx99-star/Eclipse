import PrevQuiz from "@/components/PrevQuiz";
import QuizGenerator from "@/components/QuizGenerator";
import { getPrevQuizHistory } from "@/lib/actions/featuresActions";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const result = await getPrevQuizHistory(id);

  return (
    <div>
      <PrevQuiz quizData={result} />
    </div>
  );
};

export default page;
