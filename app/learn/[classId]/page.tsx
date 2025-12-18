"use client";

import Reveal from "@/components/Reveal";
import SubjectCard from "@/components/SubjectCard";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const page = () => {
  const params = useParams();
  const { classId } = params;
  const classNumber = Number(classId);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    const getSubject = async () => {
      try {
        const res = await axios.get("/api/class");
        const data = res.data; // This is the array of classes

        // Find the specific class matching the classId from the URL
        // Note: Ensure types match (e.g., if classId is a string vs number)
        const currentClass = data.find(
          (item: any) => item.gradeNumber === classNumber
        );
        console.log(currentClass);

        if (currentClass && currentClass.subjects) {
          setSubjects(currentClass.subjects);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    if (classId) {
      getSubject();
    }
  }, [classId]);

  return (
    <main className="min-h-dvh h-auto bg-[#0a0a0a]">
      <Reveal direction="up">
        <div className="py-7 gap-8 px-10 grid grid-cols-3 auto-rows-auto h-dvh">
          {subjects.map((data, index) => {
            return (
              <Link
                href={`/learn/${classNumber}/${data}`}
                key={index}
                className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-800 rounded-2xl shadow-md border-t-4 border-white hover:shadow-lg hover:-translate-y-1 transition duration-300 ease-in-out text-4xl text-white ubuntu-regular "
              >
                <div className="capitalize">{data}</div>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </main>
  );
};

export default page;
