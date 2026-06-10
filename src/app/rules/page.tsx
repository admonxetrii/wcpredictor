import { Star, ShieldCheck, Clock } from "lucide-react";
import { WorldCupTrophy } from "@/components/icons/WorldCupTrophy";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-vintage-forest py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-vintage-paper rounded-xl shadow-vintage p-8 border border-vintage-gold/30">
        <div className="text-center mb-10">
          <WorldCupTrophy className="mx-auto h-12 w-12 text-vintage-gold mb-4" />
          <h1 className="text-3xl font-serif font-bold text-vintage-charcoal">Rules & Format</h1>
          <p className="mt-2 text-vintage-charcoal/80">FIFA World Cup 2026 Predictor</p>
        </div>

        <div className="space-y-8 text-vintage-charcoal">
          
          <section>
            <h2 className="text-xl font-bold border-b border-vintage-gold/20 pb-2 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-vintage-gold h-5 w-5" />
              Registration & Entry
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Registration is only done by logging in with the Google SSO button first.</li>
              <li>You must select one <strong>Final Tournament Winner</strong> during registration. This choice is final and cannot be changed.</li>
              <li><strong>Entry Fee:</strong> NRS. 1,000 must be paid offline.</li>
              <li><strong>Admin Approval:</strong> Your account will be strictly locked from predicting until an Admin manually approves your payment.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold border-b border-vintage-gold/20 pb-2 mb-4 flex items-center gap-2">
              <Clock className="text-vintage-gold h-5 w-5" />
              Prediction Windows
            </h2>
            <p className="mb-2">All predictions must be submitted before the lock time.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Predictions for any match lock exactly <strong>1 hour before kickoff</strong>.</li>
              <li>Once locked, predictions cannot be edited.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold border-b border-vintage-gold/20 pb-2 mb-4 flex items-center gap-2">
              <Star className="text-vintage-gold h-5 w-5" />
              Scoring System
            </h2>
            <div className="bg-white/50 rounded-lg p-4 border border-vintage-gold/10">
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 text-center font-bold text-vintage-forest bg-vintage-gold/20 rounded py-1">+10</div>
                  <div>
                    <strong>Jumbo Points:</strong> Awarded if your initial registration "Final Winner" prediction matches the actual tournament winner.
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 text-center font-bold text-vintage-forest bg-vintage-gold/20 rounded py-1">+3</div>
                  <div>
                    <strong>Correct Winner:</strong> Correctly predicting the match winner (or draw), but not the exact score.
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 text-center font-bold text-vintage-forest bg-vintage-gold/20 rounded py-1">+5</div>
                  <div>
                    <strong>Exact Score:</strong> Correctly predicting the winner AND the exact goal score. <br/>
                    <em>Note: Penalty shootout goals are added to the final score (e.g., 1-1 after ET, 5-4 penalties = 6-5 final score).</em>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 text-center font-bold text-vintage-forest bg-vintage-gold/20 rounded py-1">+2</div>
                  <div>
                    <strong>Game Time (Knockouts Only):</strong> Correctly predicting if the match ends in Full Time, Extra Time, or Penalties.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-b border-vintage-gold/20 pb-2 mb-4">Unique Predictor Prize</h2>
            <p>
              In Knockout stages, if <strong>4 or fewer users</strong> score a perfect 7 points on a single match (5 pts for exact score + 2 pts for game time), they are flagged for a special unique prize!
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
