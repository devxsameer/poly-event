"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Custom event for programmatic navigation
const LOADER_START_EVENT = "toploader:start";

// Export function to trigger loader from other components
export function triggerTopLoader() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(LOADER_START_EVENT));
  }
}

export function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);
  const previousPathRef = useRef(pathname);
  const isLoadingRef = useRef(false);

  const updateProgress = useCallback((value: number) => {
    progressRef.current = value;
    if (barRef.current) {
      barRef.current.style.width = `${value}%`;
    }
    if (glowRef.current) {
      glowRef.current.style.left = `calc(${value}% - 6rem)`;
      glowRef.current.style.opacity = value > 0 ? "1" : "0";
    }
    if (dotRef.current) {
      dotRef.current.style.left = `calc(${value}% - 0.25rem)`;
      dotRef.current.style.opacity = value > 10 && value < 100 ? "1" : "0";
    }
  }, []);

  const show = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = "1";
    }
  }, []);

  const hide = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = "0";
    }
  }, []);

  const startLoading = useCallback(() => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    // Clear any existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    show();
    updateProgress(0);

    // Quickly jump to 20%
    requestAnimationFrame(() => {
      updateProgress(20);
    });

    // Then slowly increment
    intervalRef.current = setInterval(() => {
      const prev = progressRef.current;
      if (prev >= 90) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      // Slow down as we get higher
      const increment = prev < 50 ? 10 : prev < 80 ? 5 : 2;
      updateProgress(Math.min(prev + increment, 90));
    }, 200);
  }, [show, updateProgress]);

  const completeLoading = useCallback(() => {
    if (!isLoadingRef.current) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    updateProgress(100);

    timeoutRef.current = setTimeout(() => {
      hide();
      isLoadingRef.current = false;
      // Reset after fade out
      setTimeout(() => updateProgress(0), 300);
    }, 300);
  }, [hide, updateProgress]);

  // Handle route changes - complete loading when path changes
  useEffect(() => {
    if (previousPathRef.current !== pathname) {
      completeLoading();
      previousPathRef.current = pathname;
    }
  }, [pathname, searchParams, completeLoading]);

  // Listen for navigation start events (both clicks and programmatic)
  useEffect(() => {
    // Handle anchor clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.target &&
        !anchor.hasAttribute("download") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        const url = new URL(anchor.href);
        // Only start loading for different pages
        if (url.pathname !== pathname) {
          startLoading();
        }
      }
    };

    // Handle programmatic navigation (router.push, etc.)
    const handleProgrammaticNav = () => {
      startLoading();
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener(LOADER_START_EVENT, handleProgrammaticNav);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener(LOADER_START_EVENT, handleProgrammaticNav);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pathname, startLoading]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 right-0 z-[100] h-0.5 pointer-events-none opacity-0 transition-opacity duration-300"
      role="progressbar"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Progress bar */}
      <div
        ref={barRef}
        className="h-full w-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-[width] duration-300 ease-out"
      />

      {/* Glow effect at the end */}
      <div
        ref={glowRef}
        className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent to-white/30 blur-sm transition-[left,opacity] duration-300 ease-out opacity-0"
        style={{ left: "-6rem" }}
      />

      {/* Pulse dot at the end */}
      <div
        ref={dotRef}
        className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-[left,opacity] duration-300 ease-out opacity-0"
        style={{ left: "-0.25rem" }}
      />
    </div>
  );
}
