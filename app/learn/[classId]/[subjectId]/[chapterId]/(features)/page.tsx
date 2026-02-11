import React from "react";
import AiFeatures from "@/components/AiFeatures";
import { Suspense } from "react";
import Loading from "@/app/loading";

const page = async ({
  params,
}: {
  params: Promise<{ classId: string; subjectId: string; chapterId: string }>;
}) => {
  const { classId, subjectId, chapterId } = await params;
  const features = [
    {
      title: "Personalized Learning Paths",
      description:
        "Tailor your study plan with AI-generated learning paths based on your strengths and weaknesses.",
      image: "/images/personalized-learning.svg",
      slug: "personalized-learning",
    },
    {
      title: "AI-Powered Quiz Generator",
      description:
        "Create customized quizzes to test your knowledge and track your progress with ease.",
      image: "/images/quiz-generator.svg",
      slug: "quiz-generator",
    },
    {
      title: "Interactive Flashcards",
      description:
        "Master key concepts with AI-generated flashcards and active recall.",
      image: "/images/flashcards.svg",
      slug: "flashcards",
    },
    {
      title: "AI Mind Mapper",
      description:
        "Visualize complex concepts with AI-generated interactive mind maps.",
      image: "/images/mind-mapper.svg",
      slug: "mind-mapper",
    },
  ];

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <div>
          <h1 className="text-3xl text-center text-white font-bold uppercase">
            AI powered learning tools
          </h1>
          <h2 className="text-center text-xl text-gray-400">
            Unleash your full potential with these intelligent tools
          </h2>
        </div>
        <div className="w-full h-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-15 px-5 py-3">
          {features.map((feature: any) => (
            <AiFeatures
              key={crypto.randomUUID()}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              payLoad={{ classId, subjectId, chapterId }}
              slug={feature.slug}
            />
          ))}
        </div>
      </Suspense>
    </main>
  );
};

export default page;
