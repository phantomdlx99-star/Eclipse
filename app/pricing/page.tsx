import BackButton from "@/components/BackButton";
import GoBack from "@/components/GoBack";
import { PricingTable } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import React from "react";

const page = () => {
  const goBack = () => {
    window.history.back();
  };
  return (
    <main className="w-full h-auto p-6">
      <div className="sticky top-0 right-0 w-full h-auto px-5 py-4 mb-6">
        <BackButton />
      </div>
      <PricingTable />
    </main>
  );
};

export default page;
