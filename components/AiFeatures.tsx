"use client";

import Image from "next/image";
import React from "react";
import Button from "./Button";
import { useRouter } from "next/navigation";

const AiFeatures = ({
  title,
  description,
  image,
  payLoad,
  slug,
}: {
  title: string;
  description: string;
  image: string;
  payLoad: { classId: string; subjectId: string; chapterId: string };
  slug: string;
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-evenly items-center p-6 rounded-2xl bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 gap-5">
      <div className="w-full max-w-37.5 aspect-square mb-6 flex items-center justify-center">
        <Image
          src={image}
          alt={`Icon for ${title}`}
          width={150}
          height={150}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold uppercase text-white mb-3">
          {title}
        </h1>
        <h2 className="text-base font-medium text-gray-300 leading-relaxed">
          {description}
        </h2>
      </div>
      <Button
        label="Explore Feature"
        direction="right"
        onClick={() =>
          router.push(
            `/learn/${payLoad.classId}/${payLoad.subjectId}/${payLoad.chapterId}/${slug}`,
          )
        }
      />
    </div>
  );
};

export default AiFeatures;
