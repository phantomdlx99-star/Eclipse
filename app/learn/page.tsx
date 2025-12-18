"use client";

import axios from "axios";
import Link from "next/link";
import React from "react";
import { useState, useEffect, useRef } from "react";
import SubjectCard from "@/components/SubjectCard";
// Assuming a typical setup where react icons/svgs are available or imported,
// We will use standard inline SVGs for the feature icons.

// --- 1. Class Card Component ---
const ClassCard = ({
  grade,
  title,
  subtitle,
  features,
  color,
  link,
  slug,
}: any) => {
  // Dynamic Tailwind classes based on the color prop
  const primaryBg = `bg-${color}-500`;
  const primaryText = `text-${color}-500`;
  const primaryShadow = `shadow-lg shadow-${color}-500/50`;
  // Changed border color for dark theme
  const hoverBorder = `hover:border-${color}-500`;
  const buttonBg = `bg-${color}-600`;
  const buttonHover = `hover:bg-${color}-700`;

  // Class Card Hover Logic: Replicating the distinct visual lift
  // Note: Using a custom shadow on hover for a strong effect.
  // Adjusted shadow color for better visibility on a dark background
  const hoverShadow = `hover:shadow-2xl hover:shadow-${color}-500/30`;

  // SVG for Flash/Activity (used in feature list)
  const FlashIcon = (props: any) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      ></path>
    </svg>
  );

  // SVG for Clock/Time (used in feature list)
  const ClockIcon = (props: any) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  );

  return (
    // Changed background to bg-gray-800 and border to border-gray-700
    <Link href={`/learn/${slug}`}>
      <div
        className={`class-card bg-gray-800 p-6 rounded-2xl border border-gray-700 transition duration-300 ${hoverBorder} ${hoverShadow}`}
      >
        <div className="flex items-start">
          {/* Class Number / Icon Area */}
          <div
            className={`shrink-0 p-4 rounded-xl text-white font-black ${primaryBg} ${primaryShadow}`}
          >
            <span className="text-3xl">{slug}</span>
          </div>
          <div className="ml-5">
            {/* Changed text color to light gray/white */}
            <h3 className="text-xl font-bold text-gray-100 mt-1">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {/* Feature 1 - Changed text color to light gray */}
          <div className="flex items-center text-sm text-gray-400">
            <FlashIcon className={`w-4 h-4 mr-2 ${primaryText}`} />
            {features[0]}
          </div>
          {/* Feature 2 - Changed text color to light gray */}
          <div className="flex items-center text-sm text-gray-400">
            <ClockIcon className={`w-4 h-4 mr-2 ${primaryText}`} />
            {features[1]}
          </div>
        </div>
      </div>
    </Link>
  );
};

const subjectData = [
  {
    emoji: "🔬",
    name: "Science",
    details: "Physics, Chem, Bio",
    color: "green",
  },
  {
    emoji: "➗",
    name: "Mathematics",
    details: "Algebra & Calculus",
    color: "indigo",
  },
  { emoji: "📜", name: "History", details: "World & National", color: "amber" },
  {
    emoji: "📚",
    name: "Literature",
    details: "Prose and Poetry",
    color: "pink",
  },
  { emoji: "💻", name: "CS", details: "Programming & Logic", color: "sky" },
  { emoji: "📈", name: "Economics", details: "Micro & Macro", color: "yellow" },
];

// --- 4. Main App Component ---

const App = () => {
  const Reveal = ({ children, delay = 0, direction = "up" }: any) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Trigger animation when 10% of the element is visible
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Optional: Stop observing once visible so it doesn't re-animate
            observer.unobserve(entry.target);
          }
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px", // Trigger slightly before bottom
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, []);

    const getInitialTransform = () => {
      switch (direction) {
        case "left":
          return "-translate-x-24";
        case "right":
          return "translate-x-24";
        case "down":
          return "-translate-y-24";
        case "up":
        default:
          return "translate-y-24";
      }
    };

    return (
      <div
        ref={ref}
        style={{ transitionDelay: `${delay}ms` }}
        className={`transform transition-all duration-1000 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0 translate-x-0"
            : `opacity-0 ${getInitialTransform()}`
        }`}
      >
        {children}
      </div>
    );
  };

  const [loading, setLoading] = useState(false);
  const [newClassData, setNewClassData] = useState<Object[]>([]);
  const getData = async () => {
    try {
      setLoading(true);
      const req = await axios.get("/api/class");
      const { data } = req;
      console.log(data);
      setNewClassData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="relative">
      <div className="bg-gray-900 min-h-screen py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <Reveal>
            <header className="text-center mb-16 animate-on-scroll">
              {/* Changed text color to white */}
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                Educational Program Catalog (Next.js Example)
              </h1>
              {/* Changed text color to gray-400 */}
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Explore available classes and detailed subject pathways designed
                for student success.
              </p>
            </header>
          </Reveal>

          {/* Classes Card Section */}
          <Reveal delay={300}>
            <section className="mb-16 animate-on-scroll">
              {/* Changed text color to gray-100 and border color to indigo-700 */}
              <div className="flex justify-between items-start px-5">
                <h2 className="text-3xl font-bold text-gray-100 mb-8 border-b-2 border-indigo-700 pb-2">
                  Classes / Grades Available
                </h2>
                <Link href={"/"}>
                  <button className="bg-[#F59E0B] hover:bg-amber-400 text-[#0B0F19] px-5 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    Go Back
                  </button>
                </Link>
              </div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="grid grid-cols-2 auto-rows-auto max-sm:grid-cols-1 max-md:grid-cols-2 gap-8">
                  {newClassData.map((data, index) => (
                    <ClassCard key={index} {...data} />
                  ))}
                </div>
              )}
            </section>
          </Reveal>

          {/* Subjects Card Section */}
          <Reveal direction="right" delay={0}>
            <section className="animate-on-scroll">
              {/* Changed text color to gray-100 and border color to green-700 */}
              <h2 className="text-3xl font-bold text-gray-100 mb-8 border-b-2 border-green-700 pb-2">
                Core Subjects Portfolio
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
                {subjectData.map((data, index) => (
                  <SubjectCard key={index} {...data} />
                ))}
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default App;
