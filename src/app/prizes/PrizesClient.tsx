"use client";

import { Medal, Award, Star, Sparkles } from "lucide-react";
import { WorldCupTrophy } from "@/components/icons/WorldCupTrophy";
import { motion } from "framer-motion";

export default function PrizesClient({ totalCollected }: { totalCollected: number }) {
  const prizePools = [
    { rank: "1st Place", percentage: 50, amount: (totalCollected * 0.50), icon: <WorldCupTrophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />, color: "bg-gradient-to-br from-yellow-500/20 via-black/40 to-black/60 border-yellow-500/40 text-yellow-300 shadow-[0_0_40px_rgba(234,179,8,0.15)]", glow: "shadow-yellow-500/30" },
    { rank: "2nd Place", percentage: 25, amount: (totalCollected * 0.25), icon: <Medal className="w-12 h-12 text-gray-300 drop-shadow-[0_0_15px_rgba(209,213,219,0.5)]" />, color: "bg-gradient-to-br from-gray-400/20 via-black/40 to-black/60 border-gray-400/40 text-gray-200 shadow-[0_0_40px_rgba(156,163,175,0.1)]", glow: "shadow-gray-400/30" },
    { rank: "3rd Place", percentage: 10, amount: (totalCollected * 0.10), icon: <Medal className="w-12 h-12 text-amber-600 drop-shadow-[0_0_15px_rgba(217,119,6,0.5)]" />, color: "bg-gradient-to-br from-amber-700/30 via-black/40 to-black/60 border-amber-700/40 text-amber-500 shadow-[0_0_40px_rgba(180,83,9,0.15)]", glow: "shadow-amber-700/30" },
    { rank: "Unique Predictor", percentage: 15, amount: (totalCollected * 0.15), icon: <Star className="w-12 h-12 text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]" />, color: "bg-gradient-to-br from-purple-500/20 via-black/40 to-black/60 border-purple-500/40 text-purple-300 shadow-[0_0_40px_rgba(168,85,247,0.15)]", desc: "For perfect knockout predictions", glow: "shadow-purple-500/30" }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="max-w-5xl w-full mx-auto px-4 py-12 relative z-10 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-vintage-gold/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 relative"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-6"
        >
          <WorldCupTrophy className="w-20 h-20 text-vintage-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]" />
        </motion.div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-vintage-cream via-vintage-gold to-vintage-cream mb-4 drop-shadow-md">
          The Prize Pool
        </h1>
        <p className="text-xl text-vintage-cream/80 max-w-2xl mx-auto font-light">Current collected funds distributed among the top predictors</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-gradient-to-b from-vintage-gold/15 to-black/60 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-vintage-gold/40 shadow-[0_0_100px_rgba(212,175,55,0.15)] relative overflow-hidden mb-20 text-center group"
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-vintage-gold/30 rounded-full blur-[100px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-500/20 rounded-full blur-[100px] pointer-events-none" 
        />

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-vintage-gold" />
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-vintage-gold/90">Total Prize Pool</h2>
            <Sparkles className="w-6 h-6 text-vintage-gold" />
          </div>
          <div className="text-5xl sm:text-7xl md:text-9xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-vintage-cream to-vintage-gold/80 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] tracking-tight">
            Rs. {totalCollected.toLocaleString()}
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {prizePools.map((prize, idx) => (
          <motion.div 
            key={idx} 
            variants={item}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`p-8 rounded-[2.5rem] border backdrop-blur-2xl flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8 ${prize.color} transition-all duration-300 relative overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            
            <div className={`bg-black/60 p-6 rounded-3xl border border-white/10 shadow-inner group-hover:${prize.glow} transition-shadow duration-500`}>
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {prize.icon}
              </motion.div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row items-center md:items-baseline justify-between mb-2 gap-2">
                <h3 className="text-3xl font-bold tracking-wide">{prize.rank}</h3>
                <span className="text-lg font-bold opacity-60 bg-black/40 px-3 py-1 rounded-full border border-white/5">{prize.percentage}%</span>
              </div>
              <div className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                <span className="text-xl md:text-2xl opacity-80 mr-1">Rs.</span>
                {prize.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              {prize.desc && <div className="text-sm opacity-80 mt-3 font-medium bg-black/30 inline-block px-3 py-1 rounded-lg border border-white/5">{prize.desc}</div>}
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-20 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-vintage-cream/70 text-center text-sm shadow-2xl relative overflow-hidden"
      >
        <Award className="w-10 h-10 text-vintage-gold/50 mx-auto mb-4" />
        <p className="text-base mb-3 text-vintage-cream/90 max-w-3xl mx-auto">The total prize pool dynamically increases as more users complete their Rs. 1,000 registration fee.</p>
        <p className="text-xs opacity-50 uppercase tracking-widest font-bold">Note: Actual distributions may be slightly adjusted based on admin uploaded rule files.</p>
      </motion.div>
    </div>
  );
}
