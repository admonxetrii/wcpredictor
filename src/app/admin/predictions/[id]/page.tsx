import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { adminSubmitPrediction } from "./actions";
import { getTeamFlag } from "@/lib/constants";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default async function AdminPredictionsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/dashboard");

  const { id: targetUserId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: targetUserId }
  });

  if (!user) redirect("/admin");

  const matches = await prisma.match.findMany({
    orderBy: [{ kickoffTime: "asc" }, { matchNumber: "asc" }],
  });

  const predictions = await prisma.prediction.findMany({
    where: { userId: targetUserId }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in-up">
      <Link href="/admin" className="inline-flex items-center text-vintage-gold hover:text-vintage-gold-light mb-8 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Admin Panel
      </Link>
      
      <div className="mb-8 border-b border-white/10 pb-4">
        <h1 className="text-4xl font-serif font-bold text-vintage-cream mb-2">Manual Log: {user.name}</h1>
        <p className="text-vintage-cream/60">Submit or override predictions on behalf of {user.name} ({user.email}).</p>
      </div>

      <div className="space-y-6">
        {matches.map(match => {
          const prediction = predictions.find(p => p.matchId === match.id);
          
          return (
            <div key={match.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-white/10 pb-4">
                <div>
                  <div className="text-xs font-bold uppercase text-vintage-gold tracking-widest mb-1">
                    Match {match.matchNumber} • {match.stage}
                  </div>
                  <div className="font-serif font-bold text-xl text-vintage-cream flex items-center gap-2">
                    {getTeamFlag(match.teamA)} {match.teamAName} vs {getTeamFlag(match.teamB)} {match.teamBName}
                  </div>
                </div>
              </div>

              <form className="flex flex-col md:flex-row md:items-end gap-4" action={adminSubmitPrediction}>
                <input type="hidden" name="matchId" value={match.id} />
                <input type="hidden" name="userId" value={user.id} />
                
                <div className="flex gap-4">
                  <div>
                    <label className="block text-xs font-bold text-vintage-cream/60 mb-2">{match.teamAName}</label>
                    <input 
                      type="number" 
                      name="predictedScoreA" 
                      min="0" 
                      defaultValue={prediction?.predictedScoreA ?? ""} 
                      className="w-16 bg-black/40 border border-white/20 rounded-xl p-2 text-center focus:outline-none focus:border-vintage-gold shadow-inner" 
                      required 
                    />
                  </div>
                  <div className="flex items-center text-xl font-serif text-white/40 mt-4">-</div>
                  <div>
                    <label className="block text-xs font-bold text-vintage-cream/60 mb-2">{match.teamBName}</label>
                    <input 
                      type="number" 
                      name="predictedScoreB" 
                      min="0" 
                      defaultValue={prediction?.predictedScoreB ?? ""} 
                      className="w-16 bg-black/40 border border-white/20 rounded-xl p-2 text-center focus:outline-none focus:border-vintage-gold shadow-inner" 
                      required 
                    />
                  </div>
                </div>

                <SubmitButton className="bg-vintage-gold text-vintage-forest px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50" loadingText="Saving...">
                  {prediction ? "Update Prediction" : "Log Prediction"}
                </SubmitButton>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
