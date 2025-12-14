"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Circle, Menu, X } from "lucide-react";
import { Link as ScrollLink, Element } from "react-scroll";
import { SignIn, UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isSignedIn } = useUser();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 border-b border-white/10 transition-all duration-300 ${
        isScrolled ? "glass-nav shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <ScrollLink to="home" offset={100} duration={1000} smooth={true}>
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
          </ScrollLink>

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
            {isSignedIn ? (
              <UserButton />
            ) : (
              <Link href={"/sign-in"}>
                <button className="text-sm font-medium hover:text-white text-gray-300 transition-colors">
                  Log in
                </button>
              </Link>
            )}
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
  );
};

export default Navbar;
