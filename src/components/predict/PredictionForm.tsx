"use client";

import { submitPrediction } from "@/app/predict/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { toast } from "sonner";

interface PredictionFormProps {
  matchId: string;
  teamA: string;
  teamB: string;
  isKnockout: boolean;
  existingPrediction?: {
    predictedScoreA: number;
    predictedScoreB: number;
    predictedGameTime?: string | null;
  } | null;
}

export default function PredictionForm({ matchId, teamA, teamB, isKnockout, existingPrediction }: PredictionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <form 
      onSubmit={async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        try {
          const promise = submitPrediction(formData);
          toast.promise(promise, {
            loading: 'Saving prediction...',
            success: 'Prediction saved successfully!',
            error: (err) => err.message || 'Failed to save prediction'
          });
          await promise;
        } catch {} finally {
          setIsSubmitting(false);
        }
      }}
      className="space-y-8 max-w-lg mx-auto"
    >
      <input type="hidden" name="matchId" value={matchId} />
      
      <div className="flex justify-center items-center gap-6">
        <div className="text-center flex-1">
          <label className="block text-sm font-bold text-vintage-cream mb-2">{teamA}</label>
          <input 
            type="number" 
            name="predictedScoreA"
            min="0"
            required
            defaultValue={existingPrediction?.predictedScoreA ?? ""}
            className="w-24 text-center text-4xl font-serif py-3 border-2 border-white/20 rounded-xl focus:ring-vintage-gold focus:border-vintage-gold bg-white/10 text-white shadow-inner"
          />
        </div>
        
        <div className="text-vintage-gold font-serif font-bold text-2xl pt-6">-</div>
        
        <div className="text-center flex-1">
          <label className="block text-sm font-bold text-vintage-cream mb-2">{teamB}</label>
          <input 
            type="number" 
            name="predictedScoreB"
            min="0"
            required
            defaultValue={existingPrediction?.predictedScoreB ?? ""}
            className="w-24 text-center text-4xl font-serif py-3 border-2 border-white/20 rounded-xl focus:ring-vintage-gold focus:border-vintage-gold bg-white/10 text-white shadow-inner"
          />
        </div>
      </div>

      {isKnockout && (
        <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-inner">
          <label className="block text-xs uppercase tracking-widest font-bold text-vintage-cream/70 mb-4 text-center">
            How will the match end? (Bonus +2 pts)
          </label>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <label className="flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all w-full sm:w-auto">
              <input type="radio" name="predictedGameTime" value="REGULAR" defaultChecked={existingPrediction?.predictedGameTime === "REGULAR" || !existingPrediction} className="text-vintage-gold focus:ring-vintage-gold bg-black/50 border-white/20" />
              <span className="text-sm font-bold text-vintage-cream tracking-wide">90 Mins</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all w-full sm:w-auto">
              <input type="radio" name="predictedGameTime" value="EXTRA_TIME" defaultChecked={existingPrediction?.predictedGameTime === "EXTRA_TIME"} className="text-vintage-gold focus:ring-vintage-gold bg-black/50 border-white/20" />
              <span className="text-sm font-bold text-vintage-cream tracking-wide">120 Mins</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all w-full sm:w-auto">
              <input type="radio" name="predictedGameTime" value="PENALTIES" defaultChecked={existingPrediction?.predictedGameTime === "PENALTIES"} className="text-vintage-gold focus:ring-vintage-gold bg-black/50 border-white/20" />
              <span className="text-sm font-bold text-vintage-cream tracking-wide">Penalties</span>
            </label>
          </div>
        </div>
      )}

      <div className="pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full flex items-center justify-center py-4 rounded-xl bg-gradient-to-r from-vintage-gold to-yellow-500 text-vintage-charcoal font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Saving...
            </>
          ) : (
            existingPrediction ? "Update Prediction" : "Lock In Prediction"
          )}
        </button>
      </div>
    </form>
  );
}
