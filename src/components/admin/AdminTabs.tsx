"use client";

import { useState } from "react";

export default function AdminTabs({ usersContent, matchesContent }: { usersContent: React.ReactNode, matchesContent: React.ReactNode }) {
  const [tab, setTab] = useState<"users" | "matches">("users");

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
      <div className="flex justify-start sm:justify-center p-4 border-b border-white/10 bg-black/20 overflow-x-auto w-full custom-scrollbar">
        <div className="inline-flex flex-nowrap gap-2 bg-black/40 backdrop-blur-md rounded-2xl p-1.5 border border-white/10 shadow-inner min-w-max">
          <button 
            onClick={() => setTab("users")}
            className={`px-6 md:px-8 py-3 rounded-xl font-bold tracking-widest uppercase text-xs md:text-sm whitespace-nowrap transition-all duration-300 ${tab === "users" ? "bg-vintage-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]" : "text-white/50 hover:text-white hover:bg-white/5"}`}
          >
            Users & Approvals
          </button>
          <button 
            onClick={() => setTab("matches")}
            className={`px-6 md:px-8 py-3 rounded-xl font-bold tracking-widest uppercase text-xs md:text-sm whitespace-nowrap transition-all duration-300 ${tab === "matches" ? "bg-vintage-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]" : "text-white/50 hover:text-white hover:bg-white/5"}`}
          >
            Match Results & Scoring
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {tab === "users" ? usersContent : matchesContent}
      </div>
    </div>
  );
}
