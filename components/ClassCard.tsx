"use client";

import React from "react";
import { ClassLevel } from "@/lib/constant"; // Adjust path as needed
import { ArrowRight, BookOpen, Layers } from "lucide-react";
import { useRouter } from "next/navigation";

interface ClassCardProps {
  classData: ClassLevel;
}

const ClassCard: React.FC<ClassCardProps> = ({ classData }) => {
  const router = useRouter();
  const exploreSubject = () => {
    router.push(`/learn/${classData.id}`);
  };

  return (
    <div className="group relative overflow-hidden rounded-(--radius) border border-border bg-card p-1 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 dark:bg-card/50">
      {/* Visual Texture/Glow Effect */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100" />

      <div className="relative rounded-[calc(var(--radius)-4px)] bg-background p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-2xl bg-accent p-3 text-accent-foreground">
            <Layers size={24} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            GSEB Curriculum
          </span>
        </div>

        <h3 className="font-display text-2xl font-bold text-foreground">
          {classData.title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Access comprehensive resources for {classData.subjects.length} core
          subjects.
        </p>

        <div className="mt-6 space-y-3">
          {classData.subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 p-3 transition-colors hover:bg-muted"
            >
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="ubuntu-medium text-sm font-medium">
                {subject.name}
              </span>
            </div>
          ))}
        </div>

        <button
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-transform active:scale-95"
          onClick={exploreSubject}
        >
          Explore Subjects
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
