"use client";

import { updateMatchResult, updateMatchTeams, resetMatchResult } from "@/app/admin/actions";
import { format } from "date-fns";
import { Settings2, Save, Calculator, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEAM_FLAGS, getTeamFlag, getTeamName } from "@/lib/constants";
import { SubmitButton } from "@/components/ui/SubmitButton";

function MatchRow({ match, index }: { match: any, index: number }) {
  const hasResult = match.actualScoreA !== null;
  const teamCodes = Object.keys(TEAM_FLAGS).filter(c => c !== "TBD").sort();

  const [teamA, setTeamA] = useState(match.teamA);
  const [teamAName, setTeamAName] = useState(match.teamAName);
  const [teamB, setTeamB] = useState(match.teamB);
  const [teamBName, setTeamBName] = useState(match.teamBName);

  useEffect(() => {
    setTeamA(match.teamA);
    setTeamAName(match.teamAName);
    setTeamB(match.teamB);
    setTeamBName(match.teamBName);
  }, [match]);

  const handleTeamAChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTeamA(val);
    if (val !== "TBD") setTeamAName(getTeamName(val));
  };

  const handleTeamBChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTeamB(val);
    if (val !== "TBD") setTeamBName(getTeamName(val));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-black/30 backdrop-blur-md border border-white/5 rounded-[1.5rem] p-5 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)] relative overflow-hidden group mb-6"
    >
      {/* Internal ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-vintage-gold/0 via-vintage-gold/5 to-vintage-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header: Match Num, Stage, Time */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-vintage-gold bg-black/40 px-3 py-1.5 rounded-full shadow-inner border border-white/10">
            Match {match.matchNumber}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 text-vintage-cream/80 px-2 py-1 rounded-md border border-white/10">
            {match.stage.replace(/_/g, ' ')}
          </span>
        </div>
        <span className="text-[11px] text-vintage-cream/80 font-medium tracking-wide">
          {format(new Date(match.kickoffTime), "MMM d, h:mm a")}
        </span>
      </div>

      {/* Content: Team A, Admin Score Form, Team B */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center bg-black/20 rounded-[1.25rem] p-4 shadow-inner border border-white/5 relative z-10">
        
        {/* Team A */}
        <div className="flex items-center justify-start gap-2 md:gap-3 z-10 w-full min-w-0 pr-1">
          <span className="text-3xl md:text-4xl shrink-0 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{getTeamFlag(match.teamA)}</span>
          <span className="font-serif font-bold text-[12px] md:text-[14px] text-vintage-cream text-left leading-tight whitespace-normal break-words min-w-0 flex-1">{match.teamAName}</span>
        </div>

        {/* Admin Scoring Form */}
        <div className="flex flex-col items-center gap-2 z-10 px-2 md:px-4 shrink-0">
          <form action={updateMatchResult} className="flex flex-col items-center gap-2 w-full">
            <input type="hidden" name="matchId" value={match.id} />
            
            <div className="flex items-center gap-1 md:gap-2">
              <input 
                type="number" 
                name="actualScoreA" 
                min="0" 
                defaultValue={match.actualScoreA ?? ""} 
                required
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
                    e.preventDefault();
                  }
                }}
                className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-serif bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-vintage-gold focus:border-vintage-gold text-white transition-all outline-none shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] hover:bg-white/10" 
                placeholder="-" 
              />
              <span className="text-white/30 font-bold px-1">:</span>
              <input 
                type="number" 
                name="actualScoreB" 
                min="0" 
                defaultValue={match.actualScoreB ?? ""} 
                required
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
                    e.preventDefault();
                  }
                }}
                className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-serif bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-vintage-gold focus:border-vintage-gold text-white transition-all outline-none shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] hover:bg-white/10" 
                placeholder="-" 
              />
            </div>

            <div className="flex items-center justify-center gap-2 mt-2">
              {match.stage !== "GROUP" && (
                <select name="actualGameTime" defaultValue={match.actualGameTime || "FULL_TIME"} className="bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none focus:border-vintage-gold shadow-inner uppercase font-bold tracking-wider cursor-pointer">
                  <option value="FULL_TIME">90'</option>
                  <option value="EXTRA_TIME">120'</option>
                  <option value="PENALTY">PEN</option>
                </select>
              )}
              <SubmitButton className="bg-vintage-gold/10 text-vintage-gold hover:bg-vintage-gold hover:text-black px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 border border-vintage-gold/20 shadow-lg" loadingText="Saving">
                <Save className="w-3 h-3" /> Save
              </SubmitButton>
            </div>
          </form>
          
          {(hasResult || (match.stage !== "GROUP" && match.teamA !== "TBD")) && (
            <form action={resetMatchResult} className="flex w-full justify-center">
              <input type="hidden" name="matchId" value={match.id} />
              <SubmitButton 
                className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 border border-red-500/20 shadow-lg" 
                loadingText="Resetting"
              >
                <X className="w-3 h-3" /> Reset
              </SubmitButton>
            </form>
          )}
        </div>

        {/* Team B */}
        <div className="flex items-center justify-end gap-2 md:gap-3 z-10 w-full min-w-0 pl-1">
          <span className="font-serif font-bold text-[12px] md:text-[14px] text-vintage-cream text-right leading-tight whitespace-normal break-words min-w-0 flex-1">{match.teamBName}</span>
          <span className="text-3xl md:text-4xl shrink-0 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{getTeamFlag(match.teamB)}</span>
        </div>

      </div>

      {/* Admin Teams Form (If Knockout) */}
      {match.stage !== "GROUP" && (
        <div className="mt-6 pt-5 border-t border-white/10 relative z-10">
           <div className="flex items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-vintage-gold/80 flex items-center gap-1.5"><Settings2 className="w-3.5 h-3.5" /> Set Knockout Teams</span>
           </div>
           
           <form action={updateMatchTeams} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-4 bg-white/5 p-4 rounded-xl border border-white/5 shadow-inner">
              <input type="hidden" name="matchId" value={match.id} />
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[9px] uppercase tracking-wider text-vintage-cream/60 font-bold pl-1">Team A Code & Name</label>
                <div className="flex gap-2">
                  <select name="teamA" value={teamA} onChange={handleTeamAChange} className="w-24 bg-black/60 border border-white/20 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-vintage-gold text-white font-bold cursor-pointer">
                     <option value="TBD">TBD</option>
                     {teamCodes.map(c => <option key={c} value={c} disabled={c === teamB && c !== "TBD"}>{c}</option>)}
                  </select>
                  <input name="teamAName" value={teamAName} onChange={e => setTeamAName(e.target.value)} placeholder="Name (e.g. Winner M73)" required className="flex-1 min-w-0 bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-vintage-gold text-white font-serif" />
                </div>
              </div>

              <div className="flex items-center justify-center sm:pb-0.5">
                <SubmitButton className="bg-white/10 hover:bg-vintage-gold hover:text-black text-[10px] font-black px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 uppercase tracking-widest w-full sm:w-auto shadow-md border border-white/10 hover:border-vintage-gold" loadingText="Updating">
                  <Save className="w-3.5 h-3.5" /> Update
                </SubmitButton>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[9px] uppercase tracking-wider text-vintage-cream/60 font-bold pl-1 sm:text-right">Team B Code & Name</label>
                <div className="flex gap-2">
                  <input name="teamBName" value={teamBName} onChange={e => setTeamBName(e.target.value)} placeholder="Name (e.g. Winner M74)" required className="flex-1 min-w-0 bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-vintage-gold text-white font-serif text-right" />
                  <select name="teamB" value={teamB} onChange={handleTeamBChange} className="w-24 bg-black/60 border border-white/20 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-vintage-gold text-white font-bold cursor-pointer">
                     <option value="TBD">TBD</option>
                     {teamCodes.map(c => <option key={c} value={c} disabled={c === teamA && c !== "TBD"}>{c}</option>)}
                  </select>
                </div>
              </div>
           </form>
        </div>
      )}

    </motion.div>
  );
}

export default function MatchManagement({ matches }: { matches: any[] }) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-2">
      {matches.map((match, idx) => (
        <MatchRow key={match.id} match={match} index={idx} />
      ))}
    </div>
  );
}
