"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "./actions";
import { Mail, Loader2 } from "lucide-react";
import { WorldCupTrophy } from "@/components/icons/WorldCupTrophy";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const lastSentStr = localStorage.getItem("lastPasswordResetSent");
    if (lastSentStr) {
      const lastSent = parseInt(lastSentStr, 10);
      const elapsed = Math.floor((Date.now() - lastSent) / 1000);
      if (elapsed < 120) {
        setCooldown(120 - elapsed);
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const promise = sendPasswordResetEmail(formData).then((res) => {
        if (res?.success === false) {
          throw new Error(res.error);
        }
        return res;
      });

      toast.promise(promise, {
        loading: "Sending reset email...",
        success: "If an account exists, a reset link was sent.",
        error: (err) => err.message || "Failed to send reset email.",
      });

      await promise;
      
      setCooldown(120);
      localStorage.setItem("lastPasswordResetSent", Date.now().toString());
    } catch (err) {
      // Ignored
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-vintage-forest soccer-field-pattern grain-overlay flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center">
          <WorldCupTrophy className="mx-auto h-12 w-12 text-vintage-gold drop-shadow-lg" />
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-vintage-cream font-serif drop-shadow-md">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-vintage-cream/80">
            Enter your email to receive a password reset link.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white/5 backdrop-blur-2xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/10">
          {cooldown > 0 && (
            <div className="bg-green-500/20 text-green-300 p-4 rounded-xl border border-green-500/30 mb-6 text-center text-sm font-medium">
              Check your inbox! If an account exists, we've sent you a reset link.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-vintage-cream/80">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-vintage-cream/40" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-vintage-gold focus:border-vintage-gold sm:text-sm bg-black/40 text-white placeholder-white/30 shadow-inner"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || cooldown > 0}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-xl text-sm font-bold text-vintage-charcoal bg-gradient-to-r from-vintage-gold to-yellow-500 hover:scale-[1.02] active:scale-95 transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Sending...
                    </>
                  ) : cooldown > 0 ? (
                    `Wait ${cooldown} seconds to resend`
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <Link href="/auth/signin" className="text-sm text-vintage-cream/60 hover:text-vintage-gold transition-colors">
                  Remember your password? Sign in
                </Link>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}
