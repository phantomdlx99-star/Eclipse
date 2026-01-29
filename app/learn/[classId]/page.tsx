import SubjectCard from "@/components/SubjectCard";
import { GSEB_CURRICULUM } from "@/lib/constant";
import React from "react";

const page = async ({ params }: { params: Promise<{ classId: string }> }) => {
  const { classId } = await params;
  const subjectsResponse = GSEB_CURRICULUM.find((cls) => cls.id === classId);
  return (
    <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-10 py-5 gap-6">
      {subjectsResponse?.subjects.map((subject) => (
        <SubjectCard key={subject.slug} subject={subject} classId={classId} />
      ))}
    </div>
  );
};

export default page;
