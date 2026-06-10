"use client";

import Link from "next/link";
import { WorldCupTrophy } from "@/components/icons/WorldCupTrophy";
import { motion, useMotionValue, useSpring, useAnimationFrame, MotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import CountdownTimer from "./CountdownTimer";

const FLAGS = [
  "🇺🇸", "🇨🇦", "🇲🇽", "🇦🇷", "🇧🇷", "🇨🇴", "🇺🇾", "🇪🇨", "🇵🇪", "🇻🇪", "🇧🇴", "🇵🇾",
  "🇨🇱", "🇫🇷", "🇪🇸", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "🇩🇪", "🇵🇹", "🇮🇹", "🇳🇱", "🇧🇪", "🇭🇷", "🇨🇭", "🇩🇰",
  "🇸🇪", "🇷🇸", "🇵🇱", "🇺🇦", "🇸🇳", "🇲🇦", "🇪🇬", "🇨🇲", "🇳🇬", "🇬🇭", "🇩🇿", "🇹🇳",
  "🇨🇮", "🇲🇱", "🇯🇵", "🇰🇷", "🇦🇺", "🇮🇷", "🇸🇦", "🇶🇦", "🇦🇪", "🇮🇶", "🇺🇿", "🇴🇲"
];

function FlagItem({ flag, index, mouseX, mouseY }: { flag: string, index: number, mouseX: MotionValue<number>, mouseY: MotionValue<number> }) {
  // Deterministic pseudo-random values between 0 and 1
  const rand1 = Math.abs(Math.sin(index * 137.5));
  const rand2 = Math.abs(Math.cos(index * 137.5));
  const rand3 = Math.abs(Math.sin(index * 291.1));
  const rand4 = Math.abs(Math.cos(index * 291.1));
  const rand5 = Math.abs(Math.sin(index * 38.4));
  const rand6 = Math.abs(Math.cos(index * 38.4));

  const angle = (index / FLAGS.length) * Math.PI * 2;
  const radius = 25 + rand1 * 45;
  const baseX = 50 + radius * Math.cos(angle);
  const baseY = 50 + radius * Math.sin(angle) * 1.5;

  const driftX = rand2 * 8 - 4;
  const driftY = rand3 * 12 - 6;

  const innerRef = useRef<HTMLDivElement>(null);
  const xOffset = useSpring(0, { stiffness: 100, damping: 15 });
  const yOffset = useSpring(0, { stiffness: 100, damping: 15 });

  useAnimationFrame(() => {
    if (!innerRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    const flagX = rect.left + rect.width / 2;
    const flagY = rect.top + rect.height / 2;

    const mx = mouseX.get();
    const my = mouseY.get();

    // Ignore if mouse is outside
    if (mx === -1000 && my === -1000) {
      xOffset.set(0);
      yOffset.set(0);
      return;
    }

    const dx = flagX - mx;
    const dy = flagY - my;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const repelRadius = 250; // Distance of the magnet effect

    if (distance < repelRadius && distance > 0) {
      const force = Math.pow((repelRadius - distance) / repelRadius, 1.5);
      const repelX = (dx / distance) * force * 150;
      const repelY = (dy / distance) * force * 150;
      xOffset.set(repelX);
      yOffset.set(repelY);
    } else {
      xOffset.set(0);
      yOffset.set(0);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: `${baseX}vw`, y: `${baseY}vh`, scale: 0.5 }}
      animate={{
        opacity: [0.1, 0.5, 0.1],
        x: [`${baseX}vw`, `${baseX + driftX}vw`, `${baseX}vw`],
        y: [`${baseY}vh`, `${baseY + driftY}vh`, `${baseY}vh`],
        scale: [0.8, 1.2, 0.8],
        rotate: [0, rand4 * 30 - 15, 0],
      }}
      transition={{
        duration: 20 + rand5 * 20,
        repeat: Infinity,
        delay: rand6 * 2,
        ease: "easeInOut",
      }}
      className="absolute text-4xl md:text-5xl filter drop-shadow-xl z-0"
      style={{ left: 0, top: 0 }}
    >
      <motion.div ref={innerRef} style={{ x: xOffset, y: yOffset }}>
        {flag}
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
    mouseX.set(clientX);
    mouseY.set(clientY);
  }

  function handleMouseLeave() {
    mouseX.set(-1000);
    mouseY.set(-1000);
  }

  return (
    <section
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-white/10 flex items-center justify-center min-h-[90vh] bg-black group cursor-default"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Vibrant Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#064E3B] to-[#451A03] z-0" />
      <div className="absolute inset-0 soccer-field-pattern opacity-10 mix-blend-overlay z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-vintage-gold/20 via-transparent to-black/60 z-0" />

      {/* Central Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vintage-gold/20 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Floating & Repelling Flags Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {mounted && FLAGS.map((flag, index) => (
          <FlagItem key={index} flag={flag} index={index} mouseX={mouseX} mouseY={mouseY} />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-vintage-gold/50 text-vintage-cream text-sm font-medium mb-8 badge-shimmer shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all hover:bg-white/20">
            <WorldCupTrophy className="w-5 h-5 text-vintage-gold drop-shadow-md" />
            <span className="drop-shadow-md">NRS. 1,000 Entry Fee - Epic Prize Pool!</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold font-serif leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-vintage-cream drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] tracking-tight">
            Predict. Compete. <br />
            <span className="text-vintage-gold drop-shadow-[0_0_40px_rgba(212,175,55,0.5)]">Win.</span>
          </h1>

          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-vintage-gold to-transparent mb-8 opacity-70" />

          <p className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light drop-shadow-md">
            The ultimate unofficial FIFA World Cup 2026 prediction arena. Call the winners,
            nail the exact scores, and claim your glory on the global leaderboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signin"
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-b from-vintage-gold to-yellow-600 text-black font-bold text-lg hover:scale-105 transition-all transform shadow-[0_0_40px_rgba(212,175,55,0.6)] border border-yellow-300/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">Enter The Tournament</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1, type: "spring", stiffness: 50 }}
          className="relative mt-20 inline-block z-20 w-full max-w-4xl"
        >
          <div className="bg-black/30 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/60 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-vintage-gold/20 rounded-full blur-[80px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-60" />
            <h3 className="text-vintage-gold font-bold font-serif mb-4 text-sm tracking-[0.3em] uppercase drop-shadow-md">Tournament Kickoff</h3>
            <CountdownTimer />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
