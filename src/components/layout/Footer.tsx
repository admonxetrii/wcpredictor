import Link from "next/link";
import { WorldCupTrophy } from "@/components/icons/WorldCupTrophy";

export default function Footer() {
  return (
    <footer className="bg-vintage-forest border-t border-vintage-gold/20 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <WorldCupTrophy className="w-6 h-6 text-vintage-gold/70" />
          <span className="font-serif font-bold text-xl tracking-widest uppercase text-vintage-cream/90">
            FIFA WC 2026 Predictor
          </span>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-vintage-cream/60">
          <Link href="/rules" className="hover:text-vintage-gold transition-colors">
            Rules & Format
          </Link>
        </div>

        <div className="text-sm text-vintage-cream/40">
          © 2026 Nisham Wagle
        </div>
      </div>
    </footer>
  );
}
