import React from "react";
import { GSEB_CURRICULUM } from "@/lib/constant";
import ClassCard from "@/components/ClassCard";

const page = () => {
  return (
    <main className="w-full h-auto px-10 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
      {GSEB_CURRICULUM.map((item: any) => (
        <ClassCard key={item.id} classData={item} />
      ))}
    </main>
  );
};

export default page;
