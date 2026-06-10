"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TOURNAMENT_START = new Date("2026-06-12T00:45:00+05:45").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isStarted, setIsStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = TOURNAMENT_START - now;

      if (distance < 0) {
        clearInterval(intervalId);
        setIsStarted(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!mounted) return null;

  if (isStarted) {
    return (
      <div className="text-center py-6">
        <h3 className="text-3xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-vintage-gold to-yellow-400 drop-shadow-md">The Tournament Has Begun!</h3>
      </div>
    );
  }

  const timeUnits = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-4 sm:gap-8 mt-8">
      {timeUnits.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center group">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl w-20 h-24 sm:w-28 sm:h-32 flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-500 group-hover:border-vintage-gold/40 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-50" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-vintage-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            <AnimatePresence mode="popLayout">
              <motion.span
                key={value}
                initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                className="text-4xl sm:text-6xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-vintage-cream/70 absolute drop-shadow-xl"
              >
                {value.toString().padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="mt-4 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-vintage-gold opacity-80 group-hover:opacity-100 transition-opacity">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
