"use client";

import Reveal from "@/components/Reveal";
import SubjectCard from "@/components/SubjectCard";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const params = useParams();
  const { classId } = params;
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    const getSubject = async () => {
      const req = await axios.post("/api/subject", { classId });
      const { data } = req;
      setSubjects(data.subjects);
    };

    getSubject();
  }, []);

  return (
    <main className="min-h-dvh h-auto bg-[#0a0a0a]">
      <Reveal direction="up">
        <div className="py-7 gap-8 px-10 grid grid-cols-3 auto-rows-auto h-dvh">
          {subjects.map((data, index) => (
            <div
              className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-800 rounded-2xl shadow-md border-t-4 border-white hover:shadow-lg hover:-translate-y-1 transition duration-300 ease-in-out text-4xl text-white ubuntu-regular "
              key={index}
            >
              {data}
            </div>
          ))}
        </div>
      </Reveal>
    </main>
  );
};

export default page;
