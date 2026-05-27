"use client";

import { useEffect, useRef } from "react";

export function useReveal() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((child) => {
              child.classList.add("visible");
            });
            // Also add visible to the element itself if it has reveal class
            if (entry.target.classList.contains("reveal")) {
              entry.target.classList.add("visible");
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
