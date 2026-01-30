"use client";

import { Card } from "./ui/card";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const ChapterCard = ({
  title,
  description,
  id,
  classSlug,
  chapterSlug,
  subjectSlug,
}: {
  title: string;
  description: string;
  id: string;
  chapterSlug: string;
  classSlug: string;
  subjectSlug: string;
}) => {
  const router = useRouter();
  const exploreFeatures = () => {
    router.push(`/learn/${classSlug}/${subjectSlug}/${chapterSlug}`);
  };

  return (
    // Added 'flex' to the outer wrapper to ensure cards in a row have equal height
    <div className="flex w-full h-full p-5 border-2 border-yellow-300 rounded-lg relative overflow-hidden before:absolute before:content[''] before:bg-yellow-400 before:top-0 before:-right-3.75 before:w-20 before:h-20 before:rounded-xl before:z-[-1]">
      <Card className="h-full w-full flex flex-row items-stretch px-5 gap-3 z-10 bg-transparent backdrop-blur-md border-2 border-gray-600">
        <div className="flex items-center">
          <Image
            src={"/images/chapters/chapterLogo.png"}
            alt="chapter-logo"
            width={100}
            height={80}
            className="rounded-sm hidden sm:block object-contain"
          />
        </div>

        {/* Changed this div to a flex-col with h-full */}
        <div className="flex flex-col justify-between items-start flex-1 gap-4 px-4 py-2">
          <div className="w-full">
            <h1 className="text-2xl font-bold text-white text-start">
              {id}. {title}
            </h1>
            <p className="text-lg font-semibold text-gray-400 text-start mt-1">
              {description}
            </p>
          </div>

          {/* mt-auto ensures the button always sits at the bottom */}
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-transform active:scale-95 cursor-pointer hover:scale-105 mt-auto"
            onClick={exploreFeatures}
          >
            Explore Chapter
            <ArrowRight size={18} />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ChapterCard;
