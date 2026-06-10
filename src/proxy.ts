import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const protectedPaths = ["/dashboard", "/predict", "/leaderboard", "/admin"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !isLoggedIn) {
    const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Block inactive users from protected routes
  if (isProtected && isLoggedIn && req.auth?.user && !(req.auth.user as { isActive?: boolean }).isActive) {
    const errorUrl = new URL("/auth/signin?error=AccessDenied", req.nextUrl.origin);
    return NextResponse.redirect(errorUrl);
  }

  // Admin route protection
  if (pathname.startsWith("/admin") && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|public).*)"],
};
