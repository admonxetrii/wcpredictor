"use client";

import { motion } from "framer-motion";

export default function ScoringBreakdown() {
  return (
    <section className="py-24 bg-vintage-forest relative overflow-hidden">
      <div className="absolute inset-0 soccer-field-pattern opacity-50 z-0" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-serif text-vintage-cream mb-4">
            Earn Points Your Way
          </h2>
          <div className="w-24 h-1 bg-vintage-gold mx-auto" />
          <p className="mt-6 text-vintage-cream/80 max-w-2xl mx-auto text-lg">
            Our scoring system rewards precision. You can earn points even if you don&apos;t nail the exact score.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Group Phase Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-vintage-paper rounded-2xl p-8 border border-vintage-gold/30"
          >
            <div className="text-vintage-gold font-bold tracking-widest text-sm mb-2 uppercase">Group Phase</div>
            <h3 className="text-2xl font-serif text-vintage-charcoal border-b border-vintage-gold/20 pb-4 mb-6">Match Points</h3>
            
            <ul className="space-y-4 text-vintage-charcoal/80">
              <li className="flex justify-between items-center">
                <span>Correct Outcome (W/D/L)</span>
                <span className="font-bold text-vintage-forest">+3 pts</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Exact Score Bonus</span>
                <span className="font-bold text-vintage-forest">+2 pts</span>
              </li>
              <li className="flex justify-between items-center bg-vintage-cream -mx-4 px-4 py-2 rounded-lg mt-2">
                <span className="font-semibold text-vintage-charcoal">Max Per Match</span>
                <span className="font-bold text-vintage-forest text-lg">5 pts</span>
              </li>
            </ul>
          </motion.div>

          {/* Knockout Phase Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-vintage-paper rounded-2xl p-8 border-2 border-vintage-gold shadow-[0_0_30px_rgba(197,160,89,0.15)] relative transform lg:-translate-y-4"
          >
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-vintage-gold text-vintage-forest font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wider">
              High Stakes
            </div>
            
            <div className="text-vintage-gold font-bold tracking-widest text-sm mb-2 uppercase">Knockout Phase</div>
            <h3 className="text-2xl font-serif text-vintage-charcoal border-b border-vintage-gold/20 pb-4 mb-6">Escalating Points</h3>
            
            <ul className="space-y-4 text-vintage-charcoal/80">
              <li className="flex justify-between items-center">
                <span>Round of 32 Base</span>
                <span className="font-bold text-vintage-forest">3 pts</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Round of 16 Base</span>
                <span className="font-bold text-vintage-forest">5 pts</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Quarterfinal Base</span>
                <span className="font-bold text-vintage-forest">7 pts</span>
              </li>
              <li className="flex justify-between items-center text-sm border-t border-dashed border-gray-300 pt-2">
                <span>+ Correct Game Time</span>
                <span className="font-bold text-vintage-gold-dark">+2 pts</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span>+ Exact Score Bonus</span>
                <span className="font-bold text-vintage-gold-dark">+2 pts</span>
              </li>
            </ul>
          </motion.div>

          {/* Jumbo Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-vintage-paper rounded-2xl p-8 border border-vintage-gold/30"
          >
            <div className="text-vintage-gold font-bold tracking-widest text-sm mb-2 uppercase">Bonuses</div>
            <h3 className="text-2xl font-serif text-vintage-charcoal border-b border-vintage-gold/20 pb-4 mb-6">Extra Rewards</h3>
            
            <ul className="space-y-6 text-vintage-charcoal/80">
              <div>
                <li className="flex justify-between items-center font-bold text-vintage-charcoal">
                  <span>Final Winner (Jumbo)</span>
                  <span className="text-vintage-forest">+10 pts</span>
                </li>
                <p className="text-sm mt-1 text-vintage-charcoal/60">Must be chosen before your first prediction locks.</p>
              </div>
              
              <div>
                <li className="flex justify-between items-center font-bold text-vintage-charcoal">
                  <span>Unique Predictor</span>
                  <span className="text-vintage-gold-dark">Double Pts</span>
                </li>
                <p className="text-sm mt-1 text-vintage-charcoal/60">Be the ONLY person in the global pool to get a perfect score on a match.</p>
              </div>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
