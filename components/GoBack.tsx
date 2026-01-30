"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const GoBack = () => {
  const router = useRouter();
  return (
    <button
      className="flex w-auto items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-transform active:scale-95 cursor-pointer hover:scale-105 mt-auto"
      onClick={() => router.back()}
    >
      Go Back
      <ArrowLeft size={18} />
    </button>
  );
};

export default GoBack;
