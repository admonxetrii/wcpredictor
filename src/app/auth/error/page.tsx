import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-vintage-forest p-4 animate-fade-in-up">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6 drop-shadow-md" />
        
        <h1 className="text-3xl font-serif font-bold text-vintage-cream mb-4">
          Access Denied
        </h1>
        
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8 text-left">
          <p className="text-white/80 leading-relaxed mb-4">
            Access Denied. Make sure that your account is approved and please contact an admin.
          </p>
          <ul className="list-disc pl-5 text-white/70 space-y-2 text-sm">
            <li><strong>Not registered yet?</strong> Ensure you have submitted your final prediction during registration.</li>
            <li><strong>Payment Pending?</strong> Please contact an Admin to verify your NRS 1,000 entry fee has been paid.</li>
            <li><strong>Already Paid?</strong> If you have already made the payment, please contact the Admin to manually approve your account.</li>
          </ul>
        </div>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg border border-white/10 shadow-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to Home
        </Link>
      </div>
    </div>
  );
}
