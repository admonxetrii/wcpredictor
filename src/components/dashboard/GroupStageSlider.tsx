"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { isMatchLocked } from "@/lib/utils";
import { submitPrediction } from "@/app/predict/actions";
import { ChevronLeft, ChevronRight, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { getTeamFlag } from "@/lib/constants";

// Sub-component to handle local state for inputs so we know when to show "Update" vs "Saved"
function MatchCardItem({ match, prediction, locked, hasResult, idx }: { match: any, prediction: any, locked: boolean, hasResult: boolean, idx: number }) {
  const [scoreA, setScoreA] = useState(prediction?.predictedScoreA?.toString() ?? "");
  const [scoreB, setScoreB] = useState(prediction?.predictedScoreB?.toString() ?? "");

  // Sync state if prediction prop changes from server action revalidation
  useEffect(() => {
    setScoreA(prediction?.predictedScoreA?.toString() ?? "");
    setScoreB(prediction?.predictedScoreB?.toString() ?? "");
  }, [prediction]);

  const isModified = prediction 
    ? (scoreA !== prediction.predictedScoreA.toString() || scoreB !== prediction.predictedScoreB.toString())
    : false;

  const [isSaving, setIsSaving] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: idx * 0.05, type: "spring", stiffness: 200, damping: 20 }}
      className="w-full"
    >
      {/* Liquid Crystal Display Card - Enhanced */}
      <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl border border-white/20 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.3)] flex flex-col relative group hover:shadow-[0_15px_50px_rgba(212,175,55,0.15)] transition-all duration-500 mt-3">
        
        {/* Glass refraction glow */}
        <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/20 blur-[80px] rounded-full group-hover:bg-vintage-gold/20 transition-colors duration-700" />
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Points Pill Badge */}
        {hasResult && prediction?.pointsAwarded !== null && prediction?.pointsAwarded !== undefined && (
           <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-950/80 text-green-400 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full border border-green-500/40 shadow-[0_4px_15px_rgba(34,197,94,0.3)] z-30 backdrop-blur-lg">
             +{prediction?.pointsAwarded} PTS
           </div>
        )}

        <div className="flex justify-between items-center mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-vintage-gold bg-black/40 px-3 py-1.5 rounded-full shadow-inner border border-white/10">
              Match {match.matchNumber}
            </span>
            {/* Status Badges */}
            {hasResult ? (
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-bold uppercase tracking-widest bg-green-500/20 text-green-300 px-2 py-1 rounded-md border border-green-500/30">FINISHED</span>
                 <span className="text-[9px] font-black tracking-widest bg-white/10 text-vintage-cream px-2 py-1 rounded-md border border-white/20 shadow-inner">
                   SCORE: {match.actualScoreA}-{match.actualScoreB}
                 </span>
              </div>
            ) : locked ? (
              <span className="text-[9px] font-bold uppercase tracking-widest bg-red-500/20 text-red-300 px-2 py-1 rounded-md border border-red-500/30">LOCKED</span>
            ) : (
              <span className="text-[9px] font-bold uppercase tracking-widest bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md border border-blue-500/30">OPEN</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-vintage-cream/80 font-medium tracking-wide">
              {new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Kathmandu',
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
              }).format(new Date(match.kickoffTime))} (NPT)
            </span>
          </div>
        </div>

        {/* Match Form */}
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            setIsSaving(true);
            const formData = new FormData(e.currentTarget);
            try {
              const promise = submitPrediction(formData);
              toast.promise(promise, {
                loading: prediction ? 'Updating prediction...' : 'Saving prediction...',
                success: prediction ? 'Prediction updated!' : 'Prediction saved!',
                error: (err) => err.message || 'Failed to save prediction'
              });
              await promise;
            } catch(e) {}
            setIsSaving(false);
          }} 
          className="flex flex-col gap-6 relative z-10"
        >
          <input type="hidden" name="matchId" value={match.id} />
          
          {/* Teams & Inputs Frame */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center bg-black/30 backdrop-blur-md rounded-[1.5rem] p-4 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
            
            {/* Internal ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-vintage-gold/0 via-vintage-gold/5 to-vintage-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Team A */}
            <div className="flex items-center justify-start gap-2 md:gap-3 z-10 w-full min-w-0 pr-1">
              <span className="text-3xl md:text-4xl shrink-0 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500">{getTeamFlag(match.teamA)}</span>
              <span className="font-serif font-bold text-[12px] md:text-[14px] text-vintage-cream text-left leading-tight whitespace-normal break-words min-w-0 flex-1">{match.teamAName}</span>
            </div>

            {/* Inputs / Scores */}
            <div className="flex justify-center items-center gap-2 z-10 px-2 md:px-4 shrink-0">
                <div className="flex items-center gap-1 md:gap-2">
                  <input 
                    type="number" 
                    name="predictedScoreA"
                    min="0"
                    required
                    disabled={locked || hasResult || isSaving}
                    value={scoreA}
                    onChange={(e) => setScoreA(e.target.value)}
                    className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-serif bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-vintage-gold focus:border-vintage-gold text-white transition-all outline-none disabled:opacity-50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] hover:bg-white/10"
                    placeholder="-"
                  />
                  <span className="text-white/30 font-bold px-1">:</span>
                  <input 
                    type="number" 
                    name="predictedScoreB"
                    min="0"
                    required
                    disabled={locked || hasResult || isSaving}
                    value={scoreB}
                    onChange={(e) => setScoreB(e.target.value)}
                    className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-serif bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-vintage-gold focus:border-vintage-gold text-white transition-all outline-none disabled:opacity-50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] hover:bg-white/10"
                    placeholder="-"
                  />
                </div>
            </div>

            {/* Team B */}
            <div className="flex items-center justify-end gap-2 md:gap-3 z-10 w-full min-w-0 pl-1">
              <span className="font-serif font-bold text-[12px] md:text-[14px] text-vintage-cream text-right leading-tight whitespace-normal break-words min-w-0 flex-1">{match.teamBName}</span>
              <span className="text-3xl md:text-4xl shrink-0 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500">{getTeamFlag(match.teamB)}</span>
            </div>

          </div>

          {/* Action Area */}
          <div className="flex justify-between items-center px-1">
            <div className="text-[11px] text-vintage-cream/40 font-medium truncate flex-1">
              {match.venue}, {match.city}
            </div>

            <div className="flex-shrink-0">
              {!(locked || hasResult) ? (
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className={`h-[40px] px-6 rounded-xl border font-black text-xs shadow-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 group/btn overflow-hidden relative disabled:opacity-50 disabled:pointer-events-none ${
                    isModified 
                      ? "bg-gradient-to-r from-vintage-gold/80 to-yellow-600 border-vintage-gold text-black"
                      : "bg-gradient-to-r from-white/10 to-white/5 hover:from-vintage-gold/80 hover:to-yellow-600 border-white/20 hover:border-vintage-gold text-vintage-cream hover:text-black"
                  }`}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />
                  <span className="relative flex items-center gap-2">
                    {isSaving ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : prediction ? (
                      isModified ? <><RefreshCw className="w-4 h-4" /> Update</> : <><CheckCircle2 className="w-4 h-4 text-green-400 group-hover/btn:text-black" /> Saved</>
                    ) : (
                      "Save"
                    )}
                  </span>
                </button>
              ) : (
                <div className="h-[40px] px-6 rounded-xl bg-black/60 border border-white/10 text-vintage-cream/40 font-bold text-xs shadow-inner flex items-center justify-center">
                  {hasResult ? "Results Final" : "Match Locked"}
                </div>
              )}
            </div>
          </div>
        </form>

      </div>
    </motion.div>
  );
}

function GroupStandingsTable({ groupMatches, activeGroup }: { groupMatches: any[], activeGroup: string }) {
  const standings = useMemo(() => {
    const teams = new Map<string, {
      teamCode: string;
      teamName: string;
      played: number;
      win: number;
      draw: number;
      lose: number;
      gf: number;
      ga: number;
      pts: number;
    }>();

    groupMatches.forEach(m => {
      // Initialize if not present
      if (!teams.has(m.teamA) && m.teamA !== "TBD") {
        teams.set(m.teamA, { teamCode: m.teamA, teamName: m.teamAName, played: 0, win: 0, draw: 0, lose: 0, gf: 0, ga: 0, pts: 0 });
      }
      if (!teams.has(m.teamB) && m.teamB !== "TBD") {
        teams.set(m.teamB, { teamCode: m.teamB, teamName: m.teamBName, played: 0, win: 0, draw: 0, lose: 0, gf: 0, ga: 0, pts: 0 });
      }

      if (m.actualScoreA !== null && m.actualScoreB !== null) {
        const tA = teams.get(m.teamA);
        const tB = teams.get(m.teamB);
        
        if (tA && tB) {
          tA.played++;
          tB.played++;
          
          tA.gf += m.actualScoreA;
          tA.ga += m.actualScoreB;
          
          tB.gf += m.actualScoreB;
          tB.ga += m.actualScoreA;

          if (m.actualScoreA > m.actualScoreB) {
            tA.win++;
            tA.pts += 3;
            tB.lose++;
          } else if (m.actualScoreA < m.actualScoreB) {
            tB.win++;
            tB.pts += 3;
            tA.lose++;
          } else {
            tA.draw++;
            tA.pts += 1;
            tB.draw++;
            tB.pts += 1;
          }
        }
      }
    });

    return Array.from(teams.values()).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts; // 1. Points
      const gdA = a.gf - a.ga;
      const gdB = b.gf - b.ga;
      if (gdB !== gdA) return gdB - gdA; // 2. Goal Difference
      if (b.gf !== a.gf) return b.gf - a.gf; // 3. Goals For
      return a.teamName.localeCompare(b.teamName); // 4. Alphabetical
    });
  }, [groupMatches]);

  if (standings.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full mt-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.1)] px-4 md:px-0"
    >
      <div className="p-4 md:p-6 bg-gradient-to-r from-black/60 to-black/20 border-b border-white/10 flex items-center justify-between">
        <h4 className="text-lg md:text-xl font-serif font-bold text-vintage-gold uppercase tracking-widest drop-shadow-md">
          Group {activeGroup} Standings
        </h4>
      </div>
      <div className="overflow-x-auto custom-scrollbar w-full">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[600px]">
          <thead>
            <tr className="bg-black/40 text-vintage-cream/60 text-[10px] md:text-xs uppercase tracking-[0.2em] border-b border-white/10">
              <th className="py-4 px-4 md:px-6 font-bold w-12 text-center">Pos</th>
              <th className="py-4 px-4 md:px-6 font-bold">Team</th>
              <th className="py-4 px-3 md:px-4 font-bold text-center" title="Played">P</th>
              <th className="py-4 px-3 md:px-4 font-bold text-center" title="Won">W</th>
              <th className="py-4 px-3 md:px-4 font-bold text-center" title="Drawn">D</th>
              <th className="py-4 px-3 md:px-4 font-bold text-center" title="Lost">L</th>
              <th className="py-4 px-3 md:px-4 font-bold text-center text-vintage-cream/40" title="Goals For">GF</th>
              <th className="py-4 px-3 md:px-4 font-bold text-center text-vintage-cream/40" title="Goals Against">GA</th>
              <th className="py-4 px-3 md:px-4 font-bold text-center text-vintage-cream/80" title="Goal Difference">GD</th>
              <th className="py-4 px-4 md:px-6 font-black text-vintage-gold text-center text-sm" title="Points">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm md:text-base">
            {standings.map((team, idx) => {
              const gd = team.gf - team.ga;
              return (
                <tr key={team.teamCode} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4 md:px-6 text-center font-bold text-white/50">{idx + 1}</td>
                  <td className="py-4 px-4 md:px-6 font-semibold text-white flex items-center gap-3">
                    <span className="text-2xl drop-shadow-md group-hover:scale-110 transition-transform">{getTeamFlag(team.teamCode)}</span>
                    <span className="font-serif tracking-wide truncate max-w-[150px] md:max-w-none">{team.teamName}</span>
                  </td>
                  <td className="py-4 px-3 md:px-4 text-center font-medium text-white/80">{team.played}</td>
                  <td className="py-4 px-3 md:px-4 text-center font-medium text-green-400/80">{team.win}</td>
                  <td className="py-4 px-3 md:px-4 text-center font-medium text-yellow-400/80">{team.draw}</td>
                  <td className="py-4 px-3 md:px-4 text-center font-medium text-red-400/80">{team.lose}</td>
                  <td className="py-4 px-3 md:px-4 text-center text-white/40">{team.gf}</td>
                  <td className="py-4 px-3 md:px-4 text-center text-white/40">{team.ga}</td>
                  <td className="py-4 px-3 md:px-4 text-center font-bold text-white/80">{gd > 0 ? `+${gd}` : gd}</td>
                  <td className="py-4 px-4 md:px-6 text-center font-black text-lg md:text-xl text-vintage-gold bg-black/20 border-l border-white/5 shadow-[inset_1px_0_0_rgba(255,255,255,0.05)]">
                    {team.pts}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default function GroupStageSlider({ matches, userPredictions }: { matches: any[], userPredictions: any[] }) {
  // 1. Determine all available groups
  const groups = useMemo(() => {
    const groupSet = new Set<string>();
    matches.forEach(m => {
      if (m.stage === 'GROUP' && m.groupName) {
        groupSet.add(m.groupName);
      }
    });
    return Array.from(groupSet).sort();
  }, [matches]);

  const [activeGroup, setActiveGroup] = useState<string>(groups[0] || "A");
  
  // 2. Filter matches for the active group
  const groupMatches = useMemo(() => {
    return matches.filter(m => m.stage === 'GROUP' && m.groupName === activeGroup).sort((a, b) => a.matchNumber - b.matchNumber);
  }, [matches, activeGroup]);

  if (!matches || matches.length === 0) return null;

  const currentGroupIndex = groups.indexOf(activeGroup);

  const slideLeft = () => {
    if (currentGroupIndex > 0) setActiveGroup(groups[currentGroupIndex - 1]);
  };

  const slideRight = () => {
    if (currentGroupIndex < groups.length - 1) setActiveGroup(groups[currentGroupIndex + 1]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-6">
      
      {/* Group Navigation Header */}
      <div className="flex flex-col items-center mb-10 w-full relative">
        <h3 className="text-vintage-cream/60 uppercase tracking-[0.3em] text-xs font-bold mb-2 font-serif">Select Group</h3>
        
        <div className="w-full overflow-x-auto py-4 custom-scrollbar">
          <div className="flex justify-center gap-3 min-w-max px-4">
            {groups.map(group => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`w-12 h-12 rounded-full font-black text-lg transition-all duration-300 flex items-center justify-center border backdrop-blur-xl ${
                  activeGroup === group 
                    ? "bg-gradient-to-br from-white/30 to-white/10 text-vintage-gold border-white/50 shadow-[0_0_20px_rgba(212,175,55,0.3),inset_0_2px_4px_rgba(255,255,255,0.6)] scale-110" 
                    : "bg-white/5 text-vintage-cream/60 border-white/10 hover:bg-white/10 hover:text-vintage-cream shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matches Grid / List Container */}
      <div className="relative w-full flex items-center justify-center">
        
        {/* Group Stepper Left */}
        <button 
          onClick={slideLeft} 
          disabled={currentGroupIndex === 0}
          className="hidden md:flex absolute -left-14 z-20 p-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-vintage-cream hover:bg-vintage-gold hover:text-black hover:border-vintage-gold disabled:opacity-0 disabled:cursor-not-allowed transition-all shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* The Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 py-4">
          <AnimatePresence mode="popLayout">
            {groupMatches.map((match, idx) => {
              const prediction = userPredictions.find(p => p.matchId === match.id);
              const locked = isMatchLocked(match.kickoffTime);
              const hasResult = match.actualScoreA !== null;

              return (
                <MatchCardItem 
                  key={match.id}
                  match={match}
                  prediction={prediction}
                  locked={locked}
                  hasResult={hasResult}
                  idx={idx}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Group Stepper Right */}
        <button 
          onClick={slideRight} 
          disabled={currentGroupIndex === groups.length - 1}
          className="hidden md:flex absolute -right-14 z-20 p-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-vintage-cream hover:bg-vintage-gold hover:text-black hover:border-vintage-gold disabled:opacity-0 disabled:cursor-not-allowed transition-all shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>

      {/* NEW STANDINGS TABLE */}
      <GroupStandingsTable groupMatches={groupMatches} activeGroup={activeGroup} />

    </div>
  );
}
