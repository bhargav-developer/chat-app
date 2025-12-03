"use client";

import React, { useState, useEffect, useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ContainerTextFlipProps {
  words?: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
  animationDuration?: number;
}

export function ContainerTextFlip({
  words = ["faster", "smarter", "encrypted", "limitless", "built for you"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
}: ContainerTextFlipProps) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const textRef = React.useRef<HTMLSpanElement>(null);

  const updateWidth = () => {
    if (textRef.current) setWidth(textRef.current.scrollWidth);
  };

  useEffect(() => updateWidth(), [currentWordIndex]);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentWordIndex((prev) => (prev + 1) % words.length),
      interval
    );
    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <motion.span
      layout
      layoutId={`flip-${id}`}
      animate={{ width }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative inline-flex justify-center whitespace-nowrap",
        "font-bold tracking-tight",
        "text-base sm:text-lg md:text-xl lg:text-2xl",
        "px-5 py-2",            // ⭐ added outer padding
        className
      )}
    >
      {/* Outline Border */}
      <motion.div
        layoutId={`flip-bg-${id}`}
        className="
          absolute inset-0 rounded-lg
          border border-fuchsia-500/40
          bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500/60 opacity-10
        "
      />

      {/* Glow */}
      <motion.div
        className="
          absolute inset-0 rounded-lg pointer-events-none
          bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500
          blur-2xl opacity-20
        "
      />

      {/* Animated Text */}
      <motion.span
        key={currentWordIndex}
        ref={textRef}
        className={cn(
          "relative z-10 text-white",
          "px-4 py-1", // inner padding
          textClassName
        )}
        transition={{ duration: animationDuration / 1000, ease: "easeInOut" }}
      >
        {words[currentWordIndex].split("").map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, filter: "blur(8px)", y: 4 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ delay: index * 0.015, duration: 0.3 }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.span>
    </motion.span>
  );
}
