"use client";

import Button from "@/components/Button";
import GoBack from "@/components/GoBack";
import React from "react";
import { ArrowLeft, Home } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-auto">
      <div className="w-full h-auto px-5 py-4 mb-5 flex justify-between">
        <GoBack
          label="Go Back"
          icon={<ArrowLeft size={18} />}
          onClick={() => window.history.back()}
        />
        <GoBack
          label="Go Home"
          icon={<Home size={18} />}
          onClick={() => (window.location.href = "/")}
        />
      </div>
      {children}
      <div className="w-full h-auto px-4 py-2 text-center font-semibold font-display">
        AI responses might be inaccurate so double-check the response
      </div>
    </main>
  );
};

export default Layout;
