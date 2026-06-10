import Link from "next/link";

import { isMatchLocked } from "@/lib/utils";
import { getTeamFlag } from "@/lib/constants";
import { Lock } from "lucide-react";

interface Match {
  id: string;
  matchNumber: number;
  teamA: string;
  teamB: string;
  teamAName: string;
  teamBName: string;
  kickoffTime: Date;
  actualScoreA: number | null;
  actualScoreB: number | null;
  actualGameTime?: string | null;
}

interface Prediction {
  predictedScoreA: number;
  predictedScoreB: number;
  predictedGameTime?: string | null;
  pointsAwarded: number | null;
}

interface MatchCardProps {
  match: Match;
  prediction?: Prediction;
}

export default function MatchCard({ match, prediction }: MatchCardProps) {
  const locked = isMatchLocked(match.kickoffTime);
  const hasResult = match.actualScoreA !== null;
  const isTBD = match.teamA === 'TBD' || match.teamB === 'TBD';
  const flagA = isTBD ? "🏳️" : getTeamFlag(match.teamA);
  const flagB = isTBD ? "🏳️" : getTeamFlag(match.teamB);

  const innerContent = (
      <div className="bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 rounded-3xl p-6 border border-white/10 shadow-lg hover:shadow-2xl relative h-full flex flex-col justify-between transform hover:-translate-y-1 mt-4">
        
        {/* Glow effect on hover */}
        {!isTBD && <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-vintage-gold/0 to-vintage-gold/0 group-hover:from-vintage-gold/5 group-hover:to-transparent transition-all duration-500 z-0 pointer-events-none" />}

        {/* Points Pill Badge */}
        {hasResult && prediction?.pointsAwarded !== null && prediction?.pointsAwarded !== undefined && (
           <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-950/80 text-green-400 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full border border-green-500/40 shadow-[0_4px_15px_rgba(34,197,94,0.3)] z-30 backdrop-blur-lg">
             +{prediction?.pointsAwarded} PTS
           </div>
        )}

        <div className="relative z-10 flex justify-between items-start mb-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-vintage-gold bg-black/40 px-3 py-1 rounded-full border border-white/5 z-10">
            Match {match.matchNumber}
          </span>
          {isTBD ? (
             <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] px-3 py-1 rounded-md font-black uppercase tracking-widest flex items-center gap-1 z-10">
               <Lock className="w-3 h-3" /> TBD
             </span>
          ) : hasResult ? (
            <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-[10px] px-3 py-1 rounded-md font-black uppercase tracking-widest z-10">
              FINISHED
            </span>
          ) : locked ? (
            <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] px-3 py-1 rounded-md font-black uppercase tracking-widest flex items-center gap-1 z-10">
               <Lock className="w-3 h-3" /> LOCKED
            </span>
          ) : (
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] px-3 py-1 rounded-md font-black uppercase tracking-widest z-10">OPEN</span>
          )}
        </div>

        <div className="relative z-10 flex bg-black/30 rounded-2xl border border-white/5 shadow-inner mb-6">
          <div className="flex flex-col flex-1 p-3 gap-4">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <span className={`text-3xl filter drop-shadow-md shrink-0 ${isTBD ? 'opacity-50 grayscale' : ''}`}>{flagA}</span>
              <span className={`font-serif font-bold text-lg truncate ${isTBD ? 'text-vintage-cream/50 italic text-sm' : 'text-vintage-cream'}`}>{match.teamAName}</span>
            </div>
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <span className={`text-3xl filter drop-shadow-md shrink-0 ${isTBD ? 'opacity-50 grayscale' : ''}`}>{flagB}</span>
              <span className={`font-serif font-bold text-lg truncate ${isTBD ? 'text-vintage-cream/50 italic text-sm' : 'text-vintage-cream'}`}>{match.teamBName}</span>
            </div>
          </div>
          
          {hasResult && (
            <div className="flex flex-col items-center justify-center border-l border-white/5 bg-black/20 shrink-0 min-w-[70px] self-stretch rounded-r-2xl overflow-hidden">
               <div className="flex flex-col items-center justify-center p-3 gap-6">
                 <span className="text-2xl font-serif font-black text-vintage-gold leading-none">{match.actualScoreA}</span>
                 <span className="text-2xl font-serif font-black text-vintage-gold leading-none">{match.actualScoreB}</span>
               </div>
               {match.actualGameTime && match.actualGameTime !== "REGULAR" && (
                 <div className="mt-auto w-full bg-vintage-gold/10 py-1 border-t border-vintage-gold/20 flex justify-center">
                   <span className="text-[8px] text-vintage-gold font-bold uppercase tracking-[0.2em]">
                     {match.actualGameTime.replace("_", " ")}
                   </span>
                 </div>
               )}
            </div>
          )}
        </div>

        <div className="relative z-10 mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="text-[11px] text-vintage-cream/50 font-medium">
            {new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kathmandu', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(match.kickoffTime))} (NPT)
          </div>

          <div>
            {isTBD ? (
               <span className="text-vintage-cream/30 text-xs font-bold uppercase tracking-widest">Teams Pending</span>
            ) : prediction ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-vintage-cream/50 uppercase tracking-wide font-bold">Pick:</span>
                <div className="flex flex-col bg-black/60 border border-vintage-gold/30 rounded-xl shadow-inner overflow-hidden">
                  <div className="flex justify-center px-5 py-1.5">
                    <span className="text-vintage-gold font-black font-serif text-lg leading-none">
                      {prediction.predictedScoreA} - {prediction.predictedScoreB}
                    </span>
                  </div>
                  {prediction.predictedGameTime && (
                    <div className="w-full bg-vintage-gold/10 py-1 border-t border-vintage-gold/20 flex justify-center">
                      <span className="text-[8px] text-vintage-gold font-bold uppercase tracking-[0.2em]">
                        {prediction.predictedGameTime.replace("_", " ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : hasResult ? (
              <span className="px-4 py-1.5 rounded-xl bg-black/60 border border-white/10 text-vintage-cream/40 font-bold text-[10px] uppercase tracking-widest shadow-inner inline-block">
                Results Final
              </span>
            ) : locked ? (
              <span className="px-4 py-1.5 rounded-xl bg-black/60 border border-white/10 text-vintage-cream/40 font-bold text-[10px] uppercase tracking-widest shadow-inner inline-block">
                Match Locked
              </span>
            ) : (
              <span className="text-vintage-gold font-bold text-sm group-hover:underline flex items-center gap-1 px-4 py-1.5 rounded-xl border border-vintage-gold/20 group-hover:bg-vintage-gold/10 transition-colors">
                Predict <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            )}
          </div>
        </div>

      </div>
  );

  if (isTBD) {
    return <div className="block group cursor-not-allowed opacity-80">{innerContent}</div>;
  }

  return <Link href={`/predict/${match.id}`} className="block group">{innerContent}</Link>;
}
