"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

const page = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.7 },
    );

    const element = document.querySelectorAll(".animate-on-scroll");
    element.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  return (
    <div className="w-full h-dvh flex flex-col justify-center gap-5 items-center">
      <div className="overflow-hidden rounded-xl animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
        <Image
          src={"/images/limit-banner.jpeg"}
          width={400}
          height={300}
          alt={"Limit Banner"}
          className="object-contain"
        />
      </div>
      <Link href={"/pricing"}>
        <Button className="px-8 py-6 w-auto text-2xl font-bold font-display hover:scale-104 active:scale-100 transition">
          Upgrade Plan
        </Button>
      </Link>
    </div>
  );
};

export default page;
