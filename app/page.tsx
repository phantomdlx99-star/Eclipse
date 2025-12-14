"use client";

import React, { useState, useEffect } from "react";
import {
  Rocket,
  Users,
  Award,
  PlayCircle,
  ArrowRight,
  Menu,
  X,
  Star,
  Plus,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Circle,
  Hexagon,
  Box,
  Infinity as InfinityIcon,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { Link as ScrollLink, Element } from "react-scroll";
export default function EclipseLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for fade-in animations
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
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-[#F59E0B] selection:text-[#0B0F19] overflow-x-hidden">
      {/* Custom Styles for specific animations and scrollbars */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Space+Grotesk:wght@500;700&display=swap');
        
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #111827; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #4B5563; }
        
        .glass-nav {
          background: rgba(11, 15, 25, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #FFFFFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-glow {
          background: radial-gradient(circle at center, rgba(129, 140, 248, 0.15) 0%, rgba(11, 15, 25, 0) 70%);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 border-b border-white/10 transition-all duration-300 ${
          isScrolled ? "glass-nav shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="shrink-0 flex items-center gap-2 cursor-pointer group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#F59E0B] blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Circle
                  className="w-8 h-8 text-[#0B0F19] fill-[#0B0F19] absolute z-10"
                  strokeWidth={1.5}
                />
                <div className="w-8 h-8 rounded-full border-2 border-[#F59E0B] absolute z-0"></div>
                <div className="w-full h-full rounded-full bg-[#0B0F19] absolute top-0 left-1"></div>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Eclipse
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {["Features", "Courses", "Mentors", "Pricing"].map((item) => (
                  <ScrollLink
                    to={item}
                    offset={-100}
                    duration={1000}
                    smooth={true}
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="hover:text-[#F59E0B] transition-colors px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item}
                  </ScrollLink>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button className="text-sm font-medium hover:text-white text-gray-300 transition-colors">
                Log in
              </button>
              <Link href={"/learn"}>
                <button className="bg-[#F59E0B] hover:bg-amber-400 text-[#0B0F19] px-5 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0B0F19] border-b border-white/10 absolute w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {["Features", "Courses", "Mentors"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  {item}
                </a>
              ))}
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-[#F59E0B]"
              >
                Log In
              </a>
              <a
                href="#"
                className="block px-3 py-2 mt-4 text-center rounded-md text-base font-bold bg-[#F59E0B] text-[#0B0F19]"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 hero-glow pointer-events-none"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">
              New: AI-Powered Learning Paths
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight">
            Knowledge that <br />
            <span className="gradient-text">Eclipses the Rest</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
            Master the skills of tomorrow with our immersive, expert-led
            platform. Where darkness fades, brilliance begins.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={"/learn"}>
              <button className="w-full sm:w-auto px-8 py-4 bg-[#F59E0B] hover:bg-amber-400 text-[#0B0F19] font-bold rounded-full text-lg transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2">
                Start Learning Now
                <ArrowRight size={20} fontWeight="bold" />
              </button>
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-gray-600 hover:border-white text-white font-medium rounded-full text-lg transition-all hover:bg-white/5 flex items-center justify-center gap-2">
              <PlayCircle size={24} fontWeight="fill" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-white/10 pt-12">
            {[
              { val: "50k+", label: "Learners" },
              { val: "200+", label: "Expert Mentors" },
              { val: "1.5k", label: "Courses" },
              { val: "4.9/5", label: "User Rating" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-bold text-white">{stat.val}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-10 border-y border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-bold font-display">
              <Hexagon size={24} fill="currentColor" /> HEXA
            </div>
            <div className="flex items-center gap-2 text-xl font-bold font-display">
              <Box size={24} fill="currentColor" /> CUBIC
            </div>
            <div className="flex items-center gap-2 text-xl font-bold font-display">
              <Circle size={24} fill="currentColor" /> ATOMIC
            </div>
            <div className="flex items-center gap-2 text-xl font-bold font-display">
              <InfinityIcon size={24} /> LOOP
            </div>
            <div className="flex items-center gap-2 text-xl font-bold font-display">
              <Globe size={24} /> ORBIT
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <Element name="Features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Why Choose Eclipse?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We don't just teach; we illuminate the path to mastery. Our
                platform is designed for the modern, ambitious learner.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Rocket,
                  title: "Accelerated Growth",
                  desc: "Cut through the noise. Our curated paths are designed to get you job-ready in weeks, not years.",
                },
                {
                  icon: Users,
                  title: "Global Cohorts",
                  desc: "Learn alongside peers from 120+ countries. Collaborate, compete, and grow your network.",
                },
                {
                  icon: Award,
                  title: "Industry Recognition",
                  desc: "Earn certificates that matter. Validated by top tech companies and industry leaders.",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#F59E0B]/50 transition-all duration-300 hover:-translate-y-2 group animate-on-scroll opacity-0 translate-y-10 delay-100"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center mb-6 group-hover:bg-[#F59E0B] group-hover:text-[#0B0F19] transition-colors text-[#F59E0B]">
                    <feature.icon size={32} fontWeight="fill" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Element>
      </section>

      {/* Popular Courses */}
      <section id="courses" className="py-24 bg-gray-900/50">
        <Element name="Courses">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                  Trending Courses
                </h2>
                <p className="text-gray-400">
                  Join thousands of students in our most popular tracks.
                </p>
              </div>
              <button className="text-[#F59E0B] hover:text-white font-medium flex items-center gap-2 transition-colors">
                View All Courses <ArrowRight size={16} fontWeight="bold" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "UI/UX Design Masterclass",
                  author: "Sarah Jenkins",
                  time: "12h 30m",
                  price: "$49.99",
                  color: "from-purple-600 to-blue-600",
                  tag: "Design",
                  rating: "4.9 (2.1k)",
                },
                {
                  title: "Full Stack Python",
                  author: "Mike Chen",
                  time: "24h 10m",
                  price: "$69.99",
                  color: "from-emerald-500 to-teal-700",
                  tag: "Development",
                  rating: "4.8 (1.5k)",
                },
                {
                  title: "Startup Strategy 101",
                  author: "Elena Rodriguez",
                  time: "6h 45m",
                  price: "$39.99",
                  color: "from-orange-500 to-red-600",
                  tag: "Business",
                  rating: "4.7 (890)",
                },
                {
                  title: "Social Media Domination",
                  author: "Jake Paulson",
                  time: "8h 20m",
                  price: "$29.99",
                  color: "from-pink-500 to-rose-500",
                  tag: "Marketing",
                  rating: "4.9 (3.2k)",
                },
              ].map((course, idx) => (
                <div
                  key={idx}
                  className="bg-[#111827] rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-[#F59E0B]/10 transition-all duration-300 group cursor-pointer border border-white/5 animate-on-scroll opacity-0 translate-y-10 delay-150"
                >
                  <div
                    className={`h-48 bg-linear-to-br ${course.color} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
                      {course.tag}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                      <Star
                        size={16}
                        fontWeight="fill"
                        className="text-[#F59E0B]"
                      />{" "}
                      {course.rating}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#F59E0B] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {course.author} • {course.time}
                    </p>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-white font-bold">
                        {course.price}
                      </span>
                      <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F59E0B] hover:text-[#0B0F19] transition-colors">
                        <Plus size={16} fontWeight={"bold"} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Element>
      </section>

      {/* App Download / Mobile Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-r from-[#111827] to-indigo-900/40 rounded-3xl p-8 md:p-16 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <div className="relative z-10 md:w-1/2">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Learning in your pocket.
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                Download the Eclipse app. Stream lessons, save for offline, and
                learn on your commute.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">
                  {/* Simple SVG for Apple Logo */}
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.8-1.31.02-2.3-1.23-3.14-2.47-1.71-2.45-3.02-6.92-1.26-9.99 0.88-1.54 2.45-2.51 4.15-2.54 1.29-.02 2.52.87 3.3.87.79 0 2.26-1.07 3.81-0.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.42 2.91zM13 3.5c.69-0.83 1.15-1.99 1.03-3.15-0.99.04-2.19.66-2.9 1.5-.64.75-1.2 1.96-1.05 3.1.25 0 2.22-.62 2.92-1.45z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-bold leading-none">
                      App Store
                    </div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
                  {/* Simple SVG for Play Store */}
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91,3.34,2.39,3.84,2.15L13.69,12L3.84,21.85C3.34,21.6,3,21.09,3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08,20.75,11.5,20.75,12C20.75,12.5,20.5,12.92,20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-bold leading-none">
                      Google Play
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="md:w-1/2 mt-10 md:mt-0 relative">
              {/* Abstract Phone Representation */}
              <div className="relative mx-auto border-gray-800 bg-gray-800 border-14 rounded-[2.5rem] h-100 w-55 shadow-xl animate-float">
                <div className="h-8 w-0.75 bg-gray-800 absolute -left-4.25 top-18 rounded-l-lg"></div>
                <div className="h-11.5 w-0.75 bg-gray-800 absolute -left-4.25 top-31 rounded-l-lg"></div>
                <div className="h-11.5 w-0.75 bg-gray-800 absolute -left-4.25 top-44.5 rounded-l-lg"></div>
                <div className="h-16 w-0.75 bg-gray-800 absolute -right-4.25 top-35.5 rounded-r-lg"></div>
                <div className="rounded-4xl overflow-hidden w-full h-full bg-[#0B0F19] relative">
                  {/* Screen Content */}
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center text-white/50 text-xs">
                      <span>9:41</span>
                      {/* Wifi Icon */}
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z" />
                      </svg>
                    </div>
                    <div className="h-32 bg-[#F59E0B] rounded-xl flex items-end p-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -mr-4 -mt-4"></div>
                      <span className="text-[#0B0F19] font-bold text-lg relative z-10">
                        Continue
                        <br />
                        Learning
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-12 bg-white/10 rounded-lg w-full"></div>
                      <div className="h-12 bg-white/10 rounded-lg w-full"></div>
                      <div className="h-12 bg-white/10 rounded-lg w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background decor */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#F59E0B]/20 blur-[100px] z-0"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0B0F19] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Circle
                  className="text-[#F59E0B]"
                  size={24}
                  fill="currentColor"
                />
                <span className="font-display font-bold text-2xl text-white">
                  Eclipse
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Illuminating the future of education through technology and
                community.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {[
                  "Browse Courses",
                  "Mentorship",
                  "Pricing",
                  "For Business",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-[#F59E0B] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {["About Us", "Careers", "Blog", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-[#F59E0B] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {["Terms of Use", "Privacy Policy", "Cookie Policy"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:text-[#F59E0B] transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2024 Eclipse Learning Inc. All rights reserved.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Linkedin, Instagram, Github].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon size={20} fill="currentColor" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
