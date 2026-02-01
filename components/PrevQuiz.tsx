import { CheckCircle } from "lucide-react";
import { Card } from "./ui/card";

const PrevQuiz = ({ quizData }: { quizData: any }) => {
  const {
    subjectId,
    chapterId,
    score,
    totalQuestions,
    answers,
    _id,
    createdAt,
  } = quizData;

  const correct = answers.filter(
    (item: any, index: any) => item.selected === item.correct,
  );

  return (
    <div className="fond-display">
      <div className="w-full flex justify-between px-6 py-2 items-center h-auto">
        <h1 className="text-3xl font-bold text-white capitalize">
          {subjectId}: {chapterId}
        </h1>
        <h2 className="text-2xl font-bold">Total Marks - {totalQuestions}</h2>
      </div>

      <h2 className="text-lg text-gray-400 font-semibold px-6">
        Your score for this quiz - {score}
      </h2>

      <div className="mt-10 grid grid-cols-1 w-full h-auto justify-center items-center gap-4">
        {answers?.map((item: any, idx: any) => (
          <div
            className="px-5 py-4 w-full h-auto border-3 border-primary rounded-2xl before:content-[''] before:absolute before:-top-5 before:-right-5 before:rounded-full before:w-20 before:h-20 relative before:bg-primary overflow-hidden z-5 before:-z-1 pr-10"
            key={crypto.randomUUID()}
          >
            <h1 className="text-xl font-bold text-white font-display">
              {idx + 1}. {item.question}
            </h1>
            <h2 className="text-lg font-semibold ml-6 mt-2">
              You Selected: {item.selected}
            </h2>
            <h2 className="text-lg font-semibold ml-6 mt-2">
              Correct: {item.correct}
            </h2>
          </div>
        )) ?? (
          <div>
            <h1 className="text-2xl fond-bold font-display text-white">
              It seems like the answers were not saved
            </h1>
          </div>
        )}
      </div>
      <div className="w-full h-auto px-5 py-3 flex justify-center items-center mt-4 border-3 border-primary rounded-sm flex-col relative before:content-[''] before:absolute before:-top-5 before:-right-5 before:w-20 before:h-20 before:rounded-full before:bg-primary before:-z-3 z-3 overflow-hidden ">
        <Card className="w-full h-auto px-8 flex justify-center py-2 bg-transparent backdrop-blur-2xl ">
          <h1 className="text-3xl font-display text-white text-center mb-0">
            You created and saved this quiz on{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-br from-yellow-500 to-white font-bold text-3xl ">
              {createdAt.slice(0, 10)}
            </span>
          </h1>
          <div className="flex justify-center w-auto font-display flex-col mt-1">
            <div className="flex justify-center gap-3 items-center">
              <CheckCircle size={25} color="green" />
              <h2 className="text-xl">Right Answers {correct.length}</h2>
            </div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-tr from-yellow-500 to-white text-center">
              {correct.length >= 3 ? "Nice!" : "Keep Going!"}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrevQuiz;
