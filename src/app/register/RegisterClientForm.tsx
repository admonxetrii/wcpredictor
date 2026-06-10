"use client";

import { useState } from "react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { setFinalWinner } from "./actions";
import { Loader2 } from "lucide-react";

export default function RegisterClientForm({ teams }: { teams: { code: string; name: string }[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const promise = setFinalWinner(formData);
      
      toast.promise(promise, {
        loading: "Saving your prediction and completing registration...",
        success: "Registration has been completed! Awaiting admin approval.",
        error: (err) => err.message || "Failed to complete registration",
      });

      const res = await promise;
      
      if (res?.success) {
        // Clear session and redirect to landing page
        await signOut({ callbackUrl: "/" });
      }
    } catch (error) {
      // Error handled by toast.promise
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-vintage-charcoal">
            Create a Unique Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-vintage-gold focus:border-vintage-gold sm:text-sm bg-white text-gray-900"
            placeholder="e.g. predictor2026"
            minLength={5}
            maxLength={30}
            pattern="[a-zA-Z0-9]+"
            title="Username must be at least 5 characters and contain only letters and numbers"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-vintage-charcoal">
            Set Your Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            minLength={8}
            className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-vintage-gold focus:border-vintage-gold sm:text-sm bg-white text-gray-900"
          />
          <p className="mt-1 text-xs text-vintage-charcoal/70">
            Must be at least 8 characters and include uppercase, lowercase, number, and a special character.
          </p>
        </div>

        <div>
          <label htmlFor="team" className="block text-sm font-medium text-vintage-charcoal">
            Final Tournament Winner
          </label>
          <select
            id="team"
            name="team"
            required
            className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-vintage-gold focus:border-vintage-gold sm:text-sm bg-white text-gray-900"
          >
            <option value="">Select a team...</option>
            {teams.map((team) => (
              <option key={team.code} value={team.code}>
                {team.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-red-600 font-medium">
            Warning: This prediction is final and cannot be changed!
          </p>
          <p className="mt-1 text-xs text-vintage-charcoal/70">
            Worth 10 jumbo points if they win it all.
          </p>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-glow flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-vintage-forest bg-vintage-gold hover:bg-vintage-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vintage-gold transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Completing...
            </>
          ) : (
            "Save My Champion & Finish Registration"
          )}
        </button>
      </div>
    </form>
  );
}
