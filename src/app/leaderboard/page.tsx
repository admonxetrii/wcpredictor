import { prisma } from "@/lib/prisma";
import { Medal, ArrowDown, Award } from "lucide-react";
import { WorldCupTrophy } from "@/components/icons/WorldCupTrophy";
import { getTeamFlag, getTeamName } from "@/lib/constants";
import { auth } from "@/auth";
import { getCached } from "@/lib/redis";
import { redirect } from "next/navigation";

export default async function LeaderboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");
  if (!session.user.isActive && session.user.role !== "ADMIN") {
    redirect("/auth/error?error=AccessDenied");
  }

  // By default, assume the main creator/admin shouldn't be on the leaderboard
  // but other admins (friends helping out) can still compete!
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "nishamwagle@gmail.com";

  const users = await getCached('leaderboard_users', () => prisma.user.findMany({
    where: { 
      isActive: true,
      email: { not: superAdminEmail }
    },
    orderBy: { totalPoints: "desc" },
    include: { _count: { select: { predictions: true } } }
  }));

  const top3 = users.slice(0, 3);
  const remaining = users.slice(3);

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-12 animate-fade-in-up overflow-x-hidden">
      <div className="text-center mb-16">
        <WorldCupTrophy className="w-16 h-16 text-vintage-gold mx-auto mb-6 drop-shadow-lg" />
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-vintage-cream mb-4 drop-shadow-md">Global Leaderboard</h1>
        <p className="text-lg text-vintage-cream/70">Compete for the ultimate bragging rights.</p>
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4 md:px-12 items-end">
          {/* Rank 2 */}
          {top3[1] && (
            <div className="bg-white/5 backdrop-blur-xl border border-gray-400/30 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden order-2 md:order-1 transform md:-translate-y-8">
              <div className="absolute top-0 left-0 p-4 font-serif font-bold text-gray-400 text-xl drop-shadow-md">2nd</div>
              <div className="absolute top-0 right-0 p-4"><Medal className="w-8 h-8 text-gray-400" /></div>
              <div className="w-20 h-20 mx-auto bg-gray-400/20 rounded-full flex items-center justify-center text-2xl font-bold text-gray-300 border-2 border-gray-400/50 mb-4 shadow-inner overflow-hidden">
                {top3[1].image ? <img src={top3[1].image} className="w-full h-full object-cover" alt={top3[1].name||""} /> : top3[1].name?.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{top3[1].name}</h3>
              <p className="text-gray-400 text-sm mb-4">Champion: {top3[1].finalWinnerPrediction ? `${getTeamFlag(top3[1].finalWinnerPrediction)} ${getTeamName(top3[1].finalWinnerPrediction)}` : "-"}</p>
              <div className="text-4xl font-serif font-bold text-gray-300 bg-black/20 py-2 rounded-xl border border-white/5">
                {top3[1].totalPoints} <span className="text-sm font-normal text-gray-500">pts</span>
              </div>
            </div>
          )}

          {/* Rank 1 */}
          <div className="bg-gradient-to-b from-yellow-500/20 to-white/5 backdrop-blur-xl border border-yellow-500/40 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(234,179,8,0.2)] relative overflow-hidden order-1 md:order-2 z-10">
            <div className="absolute top-0 left-0 p-4 font-serif font-bold text-yellow-400 text-2xl drop-shadow-md z-20">1st</div>
            <div className="absolute top-0 right-0 p-4 z-20"><WorldCupTrophy className="w-10 h-10 text-yellow-400 drop-shadow-lg" /></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            <div className="w-24 h-24 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center text-4xl font-bold text-yellow-300 border-2 border-yellow-400/50 mb-4 shadow-inner overflow-hidden">
              {top3[0].image ? <img src={top3[0].image} className="w-full h-full object-cover" alt={top3[0].name||""} /> : top3[0].name?.charAt(0)}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{top3[0].name}</h3>
            <p className="text-yellow-200/70 text-sm mb-6">Champion: {top3[0].finalWinnerPrediction ? `${getTeamFlag(top3[0].finalWinnerPrediction)} ${getTeamName(top3[0].finalWinnerPrediction)}` : "-"}</p>
            <div className="text-5xl font-serif font-bold text-yellow-400 drop-shadow-lg bg-black/40 py-3 rounded-2xl border border-yellow-500/20">
              {top3[0].totalPoints} <span className="text-lg font-normal text-yellow-500/50">pts</span>
            </div>
          </div>

          {/* Rank 3 */}
          {top3[2] && (
            <div className="bg-white/5 backdrop-blur-xl border border-amber-700/30 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden order-3 transform md:-translate-y-12">
              <div className="absolute top-0 left-0 p-4 font-serif font-bold text-amber-600 text-xl drop-shadow-md">3rd</div>
              <div className="absolute top-0 right-0 p-4"><Medal className="w-8 h-8 text-amber-600" /></div>
              <div className="w-16 h-16 mx-auto bg-amber-700/20 rounded-full flex items-center justify-center text-xl font-bold text-amber-500 border-2 border-amber-700/50 mb-4 shadow-inner overflow-hidden">
                {top3[2].image ? <img src={top3[2].image} className="w-full h-full object-cover" alt={top3[2].name||""} /> : top3[2].name?.charAt(0)}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{top3[2].name}</h3>
              <p className="text-amber-500/70 text-sm mb-4">Champion: {top3[2].finalWinnerPrediction ? `${getTeamFlag(top3[2].finalWinnerPrediction)} ${getTeamName(top3[2].finalWinnerPrediction)}` : "-"}</p>
              <div className="text-3xl font-serif font-bold text-amber-500 bg-black/20 py-2 rounded-xl border border-white/5">
                {top3[2].totalPoints} <span className="text-xs font-normal text-amber-700/50">pts</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Remaining Table */}
      {remaining.length > 0 && (
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden w-full max-w-full">
          <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <table className="w-full min-w-[700px] text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-black/40 text-vintage-cream/60 text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="py-5 px-6 font-semibold">Rank</th>
                  <th className="py-5 px-6 font-semibold">Player</th>
                  <th className="py-5 px-6 font-semibold text-center">Champion Pick</th>
                  <th className="py-5 px-6 font-semibold text-center">Predictions</th>
                  <th className="py-5 px-6 font-semibold text-right">Points</th>
                  <th className="py-5 px-6 font-semibold text-right">Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {remaining.map((user: any, idx: number) => {
                  const rank = idx + 4;
                  // Diff to player above them
                  const playerAbove = idx === 0 ? top3[top3.length - 1] : remaining[idx - 1];
                  const diff = playerAbove ? playerAbove.totalPoints - user.totalPoints : 0;

                  return (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-5 px-6 font-bold text-white/50">#{rank}</td>
                      <td className="py-5 px-6 font-semibold text-white flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-vintage-cream flex items-center justify-center font-bold text-sm shadow-inner group-hover:border-vintage-gold transition-colors overflow-hidden flex-shrink-0">
                          {user.image ? <img src={user.image} className="w-full h-full object-cover" alt={user.name||""} /> : user.name?.charAt(0)}
                        </div>
                        {user.name}
                      </td>
                      <td className="py-5 px-6 text-center text-sm font-medium text-vintage-gold/80 bg-black/20 border-x border-white/5">
                        {user.finalWinnerPrediction ? `${getTeamFlag(user.finalWinnerPrediction)} ${getTeamName(user.finalWinnerPrediction)}` : "-"}
                      </td>
                      <td className="py-5 px-6 text-center text-sm text-white/60">
                        {user._count.predictions}
                      </td>
                      <td className="py-5 px-6 text-right font-serif font-bold text-2xl text-white">
                        {user.totalPoints}
                      </td>
                      <td className="py-5 px-6 text-right">
                        {diff > 0 ? (
                          <div className="inline-flex items-center text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-lg">
                            <ArrowDown className="w-3 h-3 mr-1" />
                            {diff} pts
                          </div>
                        ) : (
                          <span className="text-white/20">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center py-24 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
          <Award className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-xl text-white/50 font-serif">No active players have joined the arena yet.</p>
        </div>
      )}
    </div>
  );
}
