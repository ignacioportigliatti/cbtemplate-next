"use client";

import { useEffect } from "react";

interface ScrollAnimationsProps {
  children: React.ReactNode;
}

const ScrollAnimations = ({ children }: ScrollAnimationsProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe elements after DOM is ready
    setTimeout(() => {
      const elements = document.querySelectorAll(
        ".scroll-animate, .scroll-animate-left, .scroll-animate-right"
      );
      
      elements.forEach((element) => {
        observer.observe(element);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};

export default ScrollAnimations; 