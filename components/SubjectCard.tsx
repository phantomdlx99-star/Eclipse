import React from "react";
import { BookOpen, ArrowRight } from "lucide-react"; // Optional: install lucide-react
import { Subject } from "@/lib/constant";
import Image from "next/image";
import Link from "next/link";

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard = ({ subject, classId }: any) => {
  return (
    <div className="group relative p-6 rounded-4xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-primary/20">
      {/* Glow Effect matching your globals.css hero-glow */}
      <div className="absolute inset-0 rounded-4xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="w-15 h-15 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Image
              src={`/images/subjects/${subject.name}.svg`}
              alt="subject image"
              width={55}
              height={55}
              className="rounded-full"
            />
          </div>

          <h3 className="text-2xl font-bold font-display text-foreground mb-2 group-hover:gradient-text transition-all">
            {subject.name}
          </h3>

          <p className="text-muted-foreground line-clamp-2 text-sm ubuntu-medium mb-4">
            {subject.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
            {subject.chapters.length} Chapters
          </span>
          <Link href={`/learn/${classId}/${subject.slug}`}>
            <button className="p-2 rounded-full bg-primary text-primary-foreground transform group-hover:translate-x-1 transition-transform">
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
