import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserStatsCard from "@/components/dashboard/UserStatsCard";
import MatchCard from "@/components/dashboard/MatchCard";
import GroupStageSlider from "@/components/dashboard/GroupStageSlider";
import { getCached } from "@/lib/redis";

const STAGE_CONFIG = [
  { stage: 'ROUND_OF_32', label: 'Round of 32' },
  { stage: 'ROUND_OF_16', label: 'Round of 16' },
  { stage: 'QUARTER_FINAL', label: 'Quarter-Finals' },
  { stage: 'SEMI_FINAL', label: 'Semi-Finals' },
  { stage: 'THIRD_PLACE', label: 'Third-Place Play-Off' },
  { stage: 'FINAL', label: 'Final' },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  // Fetch full user stats
  const user = await getCached(`user:${session.user.id}`, () => prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      predictions: true,
    },
  }));

  if (!user) redirect("/auth/signin");

  if (!user.isActive && user.role !== "ADMIN") {
    redirect("/auth/error?error=AccessDenied");
  }

  // Fetch all matches and join with user predictions
  const matches = await getCached('all_matches', () => prisma.match.findMany({
    orderBy: [{ kickoffTime: "asc" }, { matchNumber: "asc" }],
  }));

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "nishamwagle@gmail.com";

  // Calculate rank
  const rankQuery = await getCached(`rank:${session.user.id}`, () => prisma.user.count({
    where: { 
      totalPoints: { gt: user.totalPoints },
      isActive: true,
      email: { not: superAdminEmail }
    },
  }));
  const rank = rankQuery + 1;
  const totalUsers = await getCached('total_users', () => prisma.user.count({
    where: {
      isActive: true,
      email: { not: superAdminEmail }
    }
  }));

  // Group matches by stage
  const groupMatches = matches.filter(m => m.stage === "GROUP");
  const knockoutMatches = matches.filter(m => m.stage !== "GROUP");

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-8 animate-fade-in-up overflow-x-hidden">


      <UserStatsCard 
        points={user.totalPoints} 
        rank={rank} 
        totalUsers={totalUsers}
        predictionsCount={user.predictions.length}
        totalMatches={matches.length}
        finalWinner={user.finalWinnerPrediction}
      />

      <div className="space-y-6">
        <h2 className="text-3xl font-serif font-black text-vintage-cream border-b border-white/10 pb-4 drop-shadow-lg tracking-wide uppercase">Group Stage</h2>
        <GroupStageSlider matches={groupMatches} userPredictions={user.predictions} />
      </div>

      <div className="space-y-10 pt-10">
        <h2 className="text-3xl font-serif font-black text-vintage-cream border-b border-white/10 pb-4 drop-shadow-lg tracking-wide uppercase">Knockout Phase</h2>
        {knockoutMatches.length === 0 ? (
          <p className="text-vintage-cream/60 italic p-6 bg-white/5 rounded-2xl border border-white/10">Matches will be populated once the group stage concludes.</p>
        ) : (
          <div className="flex flex-col gap-12">
            {STAGE_CONFIG.map(({ stage, label }) => {
              const phaseMatches = knockoutMatches.filter(m => m.stage === stage);
              if (phaseMatches.length === 0) return null;

              return (
                <div key={stage} className="space-y-6">
                  <div className="flex items-center gap-2 md:gap-4 flex-wrap md:flex-nowrap">
                    <h3 className="text-sm md:text-xl font-bold text-vintage-gold uppercase tracking-[0.2em] bg-black/40 px-4 md:px-6 py-2 rounded-full border border-vintage-gold/20 shadow-inner shrink-0 w-full md:w-auto text-center md:text-left">
                      {label}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-vintage-gold/50 to-transparent" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {phaseMatches.map((match, idx) => {
                      const prediction = user.predictions.find(p => p.matchId === match.id);
                      return (
                        <div key={match.id} style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }} className="animate-fade-in-up">
                          <MatchCard match={match} prediction={prediction} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
