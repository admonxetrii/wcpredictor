import { Target, Award } from "lucide-react";
import { WorldCupTrophy } from "@/components/icons/WorldCupTrophy";
import { getTeamFlag, getTeamName } from "@/lib/constants";

interface UserStatsCardProps {
  points: number;
  rank: number;
  totalUsers: number;
  predictionsCount: number;
  totalMatches: number;
  finalWinner: string | null;
}

export default function UserStatsCard({ points, rank, totalUsers, predictionsCount, totalMatches, finalWinner }: UserStatsCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-vintage-gold/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-vintage-forest-light/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        
        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <span className="text-xs uppercase tracking-widest font-bold text-vintage-gold mb-2">Total Points</span>
          <span className="text-7xl font-serif font-bold text-white drop-shadow-lg">{points}</span>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-vintage-gold font-bold uppercase tracking-wider text-sm">
              <WorldCupTrophy className="w-5 h-5" />
              Global Rank
            </div>
            <div className="text-4xl font-serif text-white">
              #{rank} <span className="text-lg text-white/40 font-sans">of {totalUsers}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-vintage-gold font-bold uppercase tracking-wider text-sm">
              <Target className="w-5 h-5" />
              Predictions
            </div>
            <div className="text-4xl font-serif text-white">
              {predictionsCount} <span className="text-lg text-white/40 font-sans">/ {totalMatches}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 text-vintage-gold font-bold uppercase tracking-wider text-sm">
              <Award className="w-5 h-5" />
              Final Champion
            </div>
            <div className="text-2xl font-serif text-white font-bold truncate mt-1 flex items-center gap-2">
              {finalWinner ? (
                <>
                  <span className="text-3xl filter drop-shadow-md">{getTeamFlag(finalWinner)}</span>
                  <span className="truncate">{getTeamName(finalWinner)}</span>
                </>
              ) : (
                "Not Set"
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
