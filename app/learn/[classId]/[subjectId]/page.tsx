import ChapterCard from "@/components/ChapterCard";
import { GSEB_CURRICULUM } from "@/lib/constant";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ subjectId: string; classId: string }>;
}) => {
  const { subjectId, classId } = await params;
  const chapters = GSEB_CURRICULUM.find(
    (cls: any) => cls.id === classId,
  )?.subjects.find((sub: any) => sub.slug === subjectId)?.chapters;
  return (
    <div className="w-full px-5 py-3 h-auto grid grid-cols-1 lg:grid-cols-2 justify-center gap-8">
      {chapters?.map((chapter: any) => (
        <ChapterCard
          title={chapter.title}
          description={chapter.description}
          key={chapter.id}
        />
      ))}
    </div>
  );
};

export default page;
