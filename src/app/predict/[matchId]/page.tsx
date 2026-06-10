import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import PredictionForm from "@/components/predict/PredictionForm";
import { getTeamFlag } from "@/lib/constants";
import { isMatchLocked } from "@/lib/utils";
import { format } from "date-fns";

export default async function PredictPage({ params }: { params: Promise<{ matchId: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");
  if (!session.user.isActive && session.user.role !== "ADMIN") {
    redirect("/auth/error?error=AccessDenied");
  }

  const { matchId } = await params;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match) notFound();

  const prediction = await prisma.prediction.findUnique({
    where: {
      userId_matchId: {
        userId: session.user.id,
        matchId: match.id,
      },
    },
  });

  const isTimeLocked = isMatchLocked(match.kickoffTime);
  const isFinished = match.actualScoreA !== null;
  const isTBD = match.teamA === "TBD" || match.teamB === "TBD";
  const locked = isTimeLocked || isFinished || isTBD;

  let lockedMessage = "Predictions are Locked";
  if (isFinished) lockedMessage = "Match Results Finalized";
  else if (isTBD) lockedMessage = "Teams Not Yet Determined";

  const flagA = getTeamFlag(match.teamA);
  const flagB = getTeamFlag(match.teamB);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-24">
      
      {/* Liquid Crystal Display Card */}
      <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl border border-white/20 rounded-[2rem] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.3)] relative overflow-hidden group hover:shadow-[0_15px_50px_rgba(212,175,55,0.15)] transition-all duration-500">
        
        {/* Glass refraction glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-vintage-gold/20 transition-colors duration-700" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent rounded-t-[2rem] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          
          {/* Top Badges */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-8 w-full">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-vintage-gold bg-black/40 px-4 py-2 rounded-full shadow-inner border border-white/10 text-center">
              {match.stage === "GROUP" ? `Group ${match.groupName}` : match.slotDescription} • Match {match.matchNumber}
            </span>
            <span className="text-[11px] text-vintage-cream/80 font-medium tracking-wider bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-inner text-center">
               {new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Kathmandu',
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
              }).format(new Date(match.kickoffTime))} (NPT)
            </span>
          </div>

          {/* Teams Header Container */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-4 md:gap-8 mb-10">
            {/* Team A */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-6xl md:text-8xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform duration-500">{flagA}</span>
              <span className="font-serif font-bold text-xl md:text-3xl text-vintage-cream text-center leading-tight mt-2 min-w-0 break-words w-full px-2">{match.teamAName}</span>
              <span className="text-xs font-black tracking-widest uppercase text-vintage-cream/50 bg-black/40 px-3 py-1 rounded-md border border-white/5 shadow-inner mt-1">{match.teamA}</span>
            </div>

            {/* VS */}
            <div className="text-vintage-gold/50 font-serif font-black text-3xl md:text-5xl italic drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
              VS
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-6xl md:text-8xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform duration-500">{flagB}</span>
              <span className="font-serif font-bold text-xl md:text-3xl text-vintage-cream text-center leading-tight mt-2 min-w-0 break-words w-full px-2">{match.teamBName}</span>
              <span className="text-xs font-black tracking-widest uppercase text-vintage-cream/50 bg-black/40 px-3 py-1 rounded-md border border-white/5 shadow-inner mt-1">{match.teamB}</span>
            </div>
          </div>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />

          {/* Prediction Body */}
          <div className="w-full">
            {locked ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="inline-block bg-red-500/20 text-red-300 px-6 py-2.5 rounded-xl font-bold mb-8 border border-red-500/30 uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(239,68,68,0.2)] text-center">
                  {lockedMessage}
                </div>
                
                {prediction ? (
                  <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-[1.5rem] p-6 shadow-inner w-full max-w-md text-center hover:bg-black/40 transition-colors">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-vintage-cream/50 mb-3">Your Prediction</h3>
                    <div className="font-serif text-5xl font-black text-vintage-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                      {prediction.predictedScoreA} - {prediction.predictedScoreB}
                    </div>
                    {prediction.predictedGameTime && (
                      <div className="mt-3 text-xs font-bold uppercase tracking-widest text-vintage-cream/80 bg-white/5 inline-block px-3 py-1 rounded-md border border-white/10 shadow-inner">
                        ({prediction.predictedGameTime.replace("_", " ")})
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 text-center text-vintage-cream/60 w-full max-w-md font-medium tracking-wide">
                    You did not lock in a prediction for this match.
                  </div>
                )}

                {isFinished && (
                  <div className="mt-8 pt-8 border-t border-white/10 w-full max-w-md flex flex-col items-center">
                    <h3 className="text-xs font-bold text-vintage-cream/50 uppercase tracking-[0.2em] mb-4 text-center">Actual Match Result</h3>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)] w-full text-center hover:bg-green-500/20 transition-colors flex flex-col items-center">
                      <div className="font-serif text-5xl font-black text-green-400 mb-1 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                        {match.actualScoreA} - {match.actualScoreB}
                      </div>
                      
                      {match.actualGameTime && (
                        <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-green-300 bg-green-500/20 inline-block px-3 py-1 rounded-md border border-green-500/30">
                          {match.actualGameTime.replace("_", " ")}
                        </div>
                      )}

                      {prediction?.pointsAwarded !== null && (
                        <div className="text-sm font-bold text-vintage-cream/80 tracking-widest text-center mt-6 bg-black/40 rounded-lg px-4 py-2.5 border border-white/5 inline-block w-full">
                          PTS EARNED: <span className="text-vintage-gold ml-2 text-lg">+{prediction?.pointsAwarded || 0}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <PredictionForm 
                matchId={match.id} 
                teamA={match.teamAName} 
                teamB={match.teamBName} 
                isKnockout={match.stage !== "GROUP"} 
                existingPrediction={prediction} 
              />
            )}
          </div>
          
          <div className="mt-10 text-[10px] text-vintage-cream/40 uppercase tracking-widest text-center">
            {match.venue}, {match.city}
          </div>
        </div>
      </div>
    </div>
  );
}
