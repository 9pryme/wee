"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect, useState } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    if (isInView) {
      const animateText = async () => {
        // Animate current word
        await animate(
          `span.word-${currentWordIndex} span`,
          {
            opacity: 1,
          },
          {
            duration: 0.1,
            delay: stagger(0.05),
          }
        );

        // Wait for animation to complete
        const totalDuration = words[currentWordIndex].text.length * 0.05 + 2; // Add extra time for reading
        await new Promise(resolve => setTimeout(resolve, totalDuration * 1000));

        // Fade out current word
        await animate(
          `span.word-${currentWordIndex} span`,
          { opacity: 0 },
          { duration: 0.5 }
        );

        // Move to next word
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      };

      animateText();
    }
  }, [isInView, animate, currentWordIndex, words]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {words.map((word, idx) => {
          return (
            <span 
              key={`word-${idx}`} 
              className={`inline-block word-${idx}`}
              style={{ display: idx === currentWordIndex ? 'inline-block' : 'none' }}
            >
              {word.text.split("").map((char, index) => (
                <motion.span
                  initial={{ opacity: 0 }}
                  key={`char-${index}`}
                  className={cn(`opacity-0 inline-block`, word.className)}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              {" "}
            </span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("text-center", className)}>
      {renderWords()}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn("inline-block rounded-sm w-[4px] h-4 -mb-1 bg-black", cursorClassName)}
      />
    </div>
  );
};