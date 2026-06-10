"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Counter({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

export default function StatsCounter() {
  const [inView, setInView] = useState(false);

  return (
    <section className="py-20 bg-vintage-paper border-b border-vintage-gold/10">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => setInView(true)}
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="p-6 border-t-2 border-vintage-gold/40">
            <div className="text-5xl font-serif font-bold text-vintage-forest mb-2">
              {inView ? <Counter end={48} /> : "0"}
            </div>
            <div className="text-vintage-charcoal/60 uppercase tracking-widest font-semibold text-sm">Teams</div>
          </div>
          
          <div className="p-6 border-t-2 border-vintage-gold/40">
            <div className="text-5xl font-serif font-bold text-vintage-forest mb-2">
              {inView ? <Counter end={104} /> : "0"}
            </div>
            <div className="text-vintage-charcoal/60 uppercase tracking-widest font-semibold text-sm">Matches</div>
          </div>
          
          <div className="p-6 border-t-2 border-vintage-gold/40">
            <div className="text-5xl font-serif font-bold text-vintage-gold-dark mb-2">
              Unlimited
            </div>
            <div className="text-vintage-charcoal/60 uppercase tracking-widest font-semibold text-sm">Glory</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
