"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { WorldCupTrophy } from "@/components/icons/WorldCupTrophy";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === "AccessDenied" || res.error === "Configuration") {
          router.push("/auth/error?error=AccessDenied");
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-vintage-forest soccer-field-pattern grain-overlay flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <WorldCupTrophy className="mx-auto h-12 w-12 text-vintage-gold" />
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-vintage-cream font-serif drop-shadow-md">
            FIFA WC 2026 Predictor
          </h2>
          <p className="mt-2 text-center text-sm text-vintage-cream/80">
            Sign in to make your predictions
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-vintage-paper py-8 px-4 shadow-vintage sm:rounded-xl sm:px-10 border border-vintage-gold/20"
        >
          
          <form onSubmit={handleCredentialsSignIn} className="space-y-5 mb-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-vintage-charcoal mb-1">Email or Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-vintage-gold focus:border-vintage-gold sm:text-sm bg-white text-gray-900"
                  placeholder="Enter email or username"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-vintage-charcoal">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-medium text-vintage-gold hover:text-vintage-gold-dark transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-vintage-gold focus:border-vintage-gold sm:text-sm bg-white text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-vintage-forest bg-vintage-gold hover:bg-vintage-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vintage-gold transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-vintage-paper text-vintage-charcoal/60">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button
                disabled={isLoading || isGoogleLoading}
                onClick={async () => {
                  setIsGoogleLoading(true);
                  await signIn("google", { callbackUrl: "/dashboard" });
                }}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vintage-gold disabled:opacity-50 disabled:pointer-events-none"
              >
                {isGoogleLoading ? (
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-500" />
                ) : (
                  <img
                    className="h-5 w-5 mr-2"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                  />
                )}
                {isGoogleLoading ? "Connecting..." : "Google"}
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-xs text-vintage-charcoal/60">
            NRS 1,000 Entry Fee Required
          </div>
        </motion.div>
      </div>
    </div>
  );
}
