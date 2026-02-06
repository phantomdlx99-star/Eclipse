"use client";

import { Input } from "@/components/ui/input";

const page = () => {
  return (
    <main className="w-full h-auto px-8 py-4">
      <div className="sticky bottom-10 left-[42%]">
        <Input placeholder="Type your message..." />
      </div>
    </main>
  );
};

export default page;
