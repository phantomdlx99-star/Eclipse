import React from "react";
import { GSEB_CURRICULUM } from "@/lib/constant";
import ClassCard from "@/components/ClassCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="w-full h-auto px-10 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
      {GSEB_CURRICULUM.map((item: any) => (
        <ClassCard key={item.id} classData={item} />
      ))}
    </main>
  );
};

export default page;
