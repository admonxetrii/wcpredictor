"use client";

import { motion } from "framer-motion";
import { ClipboardList, Target } from "lucide-react";
import { WorldCupTrophy } from "@/components/icons/WorldCupTrophy";

const steps = [
  {
    icon: ClipboardList,
    title: "1. Create Your Bracket",
    desc: "Sign in for free and pick your final tournament winner before kickoff. This pick is locked in forever.",
  },
  {
    icon: Target,
    title: "2. Make Predictions",
    desc: "Predict match outcomes and exact scores. Group stage picks lock 1 hour before each match.",
  },
  {
    icon: WorldCupTrophy,
    title: "3. Compete & Win",
    desc: "Earn points for accuracy. Climb the global leaderboard and secure the ultimate bragging rights.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-vintage-paper border-b border-vintage-gold/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-serif text-vintage-charcoal mb-4">
            How It Works
          </h2>
          <div className="w-24 h-1 bg-vintage-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-vintage-cream rounded-2xl p-8 border border-vintage-gold/20 shadow-md hover:shadow-xl transition-all hover:-translate-y-2 group"
            >
              <div className="w-16 h-16 rounded-full bg-vintage-forest-light flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-inner">
                <step.icon className="w-8 h-8 text-vintage-gold" />
              </div>
              <h3 className="text-xl font-bold text-vintage-charcoal mb-4 text-center">
                {step.title}
              </h3>
              <p className="text-vintage-charcoal/70 text-center leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
