import React, { useState, useEffect, useRef } from "react";

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

export default Reveal;
