"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut, LayoutDashboard, ListOrdered, Shield, Settings, Menu, X } from "lucide-react";
import { WorldCupTrophy } from "@/components/icons/WorldCupTrophy";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getLinkStyle = (path: string) => {
    const isActive = pathname?.startsWith(path);
    return `flex items-center gap-2 transition-colors text-sm font-medium ${
      isActive ? "text-vintage-gold drop-shadow-sm" : "text-vintage-cream/80 hover:text-vintage-gold"
    }`;
  };

  const getMobileLinkStyle = (path: string) => {
    const isActive = pathname?.startsWith(path);
    return `flex items-center gap-3 font-medium py-2 border-b border-white/5 transition-colors ${
      isActive ? "text-vintage-gold drop-shadow-sm" : "text-vintage-cream hover:text-vintage-gold"
    }`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-vintage-forest/80 backdrop-blur-2xl border-b border-white/10 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-[65px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
          <WorldCupTrophy className="w-8 h-8 text-vintage-gold group-hover:scale-110 transition-transform" />
          <span className="font-serif font-bold text-xl tracking-wide text-vintage-cream group-hover:text-vintage-gold transition-colors">
            FIFA WC 2026 Predictor
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-6">
          {session ? (
            <>
              {(session.user?.isActive || session.user?.role === "ADMIN") && (
                <>
              <Link href="/dashboard" className={getLinkStyle("/dashboard")}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/leaderboard" className={getLinkStyle("/leaderboard")}>
                <ListOrdered className="w-4 h-4" />
                Leaderboard
              </Link>
              <Link href="/prizes" className={getLinkStyle("/prizes")}>
                <WorldCupTrophy className="w-4 h-4" />
                Prize Pool
              </Link>
              {session.user?.role === "ADMIN" && (
                <Link href="/admin" className={getLinkStyle("/admin")}>
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
              </>)}
              <div className="flex items-center gap-4 border-l border-vintage-gold/20 pl-4 ml-2">
                <Link href="/settings" className={`p-2 rounded-full hover:bg-vintage-forest-light transition-colors ${pathname?.startsWith('/settings') ? 'text-vintage-gold drop-shadow-sm' : 'text-vintage-cream/80 hover:text-vintage-cream'}`} aria-label="Settings">
                  <Settings className="w-5 h-5" />
                </Link>
                <span className="text-sm text-vintage-cream/80 font-medium">
                  {session.user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-full hover:bg-vintage-forest-light text-vintage-cream/80 hover:text-vintage-cream transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <Link 
              href="/auth/signin"
              className="px-5 py-2 text-sm font-semibold rounded-lg bg-vintage-gold text-vintage-forest hover:bg-vintage-gold-light shadow-vintage transition-all duration-150 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="sm:hidden p-2 text-vintage-cream/80 hover:text-vintage-gold transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <nav className="sm:hidden bg-vintage-forest/95 backdrop-blur-3xl border-b border-white/10 px-4 py-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2">
          {session ? (
            <>
              {(session.user?.isActive || session.user?.role === "ADMIN") && (
                <>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={getMobileLinkStyle("/dashboard")}>
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
              <Link href="/leaderboard" onClick={() => setMobileMenuOpen(false)} className={getMobileLinkStyle("/leaderboard")}>
                <ListOrdered className="w-5 h-5" />
                Leaderboard
              </Link>
              <Link href="/prizes" onClick={() => setMobileMenuOpen(false)} className={getMobileLinkStyle("/prizes")}>
                <WorldCupTrophy className="w-5 h-5" />
                Prize Pool
              </Link>
              {session.user?.role === "ADMIN" && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className={getMobileLinkStyle("/admin")}>
                  <Shield className="w-5 h-5" />
                  Admin
                </Link>
              )}
              </>)}
              <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className={getMobileLinkStyle("/settings")}>
                <Settings className="w-5 h-5" />
                Settings
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                className="flex items-center gap-3 text-red-400 hover:text-red-300 font-medium py-2 mt-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </>
          ) : (
            <Link 
              href="/auth/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-5 py-3 text-base font-bold rounded-xl bg-vintage-gold text-vintage-forest hover:bg-vintage-gold-light shadow-vintage transition-all"
            >
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
