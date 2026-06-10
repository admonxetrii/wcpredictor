"use client";

import { useState, Suspense } from "react";
import { toast } from "sonner";
import { resetPassword } from "./actions";
import { KeyRound, Loader2 } from "lucide-react";
import { WorldCupTrophy } from "@/components/icons/WorldCupTrophy";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("token", token);
    
    try {
      const promise = resetPassword(formData);
      toast.promise(promise, {
        loading: "Resetting password...",
        success: "Password reset successfully!",
        error: (err) => err.message || "Failed to reset password.",
      });
      await promise;
      router.push("/auth/signin");
    } catch (err) {
      // Ignored
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center bg-red-500/10 border border-red-500/30 p-6 rounded-xl">
        <p className="text-red-400 mb-4">Missing or invalid reset token.</p>
        <Link href="/auth/forgot-password" className="text-vintage-gold hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-vintage-cream/80">
          New Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyRound className="h-5 w-5 text-vintage-cream/40" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-vintage-gold focus:border-vintage-gold sm:text-sm bg-black/40 text-white placeholder-white/30 shadow-inner"
            placeholder="••••••••"
          />
        </div>
        <p className="mt-2 text-xs text-vintage-cream/60">
          Must be at least 8 characters and include uppercase, lowercase, number, and a special character.
        </p>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-xl text-sm font-bold text-vintage-charcoal bg-gradient-to-r from-vintage-gold to-yellow-500 hover:scale-[1.02] active:scale-95 transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Resetting...
            </>
          ) : (
            "Set New Password"
          )}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-vintage-forest soccer-field-pattern grain-overlay flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center">
          <WorldCupTrophy className="mx-auto h-12 w-12 text-vintage-gold drop-shadow-lg" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-vintage-cream font-serif drop-shadow-md">
            Create New Password
          </h2>
          <p className="mt-2 text-center text-sm text-vintage-cream/80">
            Enter your new secure password below.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white/5 backdrop-blur-2xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/10">
          <Suspense fallback={<div className="text-center text-white/50 py-4">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
