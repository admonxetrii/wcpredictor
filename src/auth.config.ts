import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        // Will be implemented in auth.ts since it requires prisma and bcrypt
        return null;
      }
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/register",
    error: "/auth/error",
  },
} satisfies NextAuthConfig;
