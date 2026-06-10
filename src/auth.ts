import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    ...authConfig.providers.filter((p: any) => p.id !== "credentials"),
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.identifier || !credentials?.password) return null;
        
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ]
          }
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const dbUser = await prisma.user.findFirst({
          where: { email: user.email },
        });
        
        // Admin bypass
        if (dbUser && dbUser.role === "ADMIN") {
          return true;
        }

        // If user exists, has set final prediction, but is NOT active, block sign in
        if (dbUser && dbUser.finalWinnerPrediction && !dbUser.isActive) {
          // Returning false completely blocks sign-in
          return false;
        }
        
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // First login: Fetch the full user from DB
        const dbUser = await prisma.user.findFirst({
          where: { email: token.email! },
          select: { id: true, role: true, isActive: true, finalWinnerPrediction: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.isActive = dbUser.isActive;
          token.hasFinalPrediction = !!dbUser.finalWinnerPrediction;
        }
      }
      
      // Handle user updates in settings
      if (trigger === "update" && session) {
        token.isActive = session.user.isActive;
        token.hasFinalPrediction = session.user.hasFinalPrediction;
      }
      
      // STRICT ALLOWLIST: NextAuth sometimes injects massive SSO objects.
      // We only return exactly what we need for our session.
      // If the user uploaded a base64 image, we MUST NOT put it in the cookie!
      const isBase64Image = typeof token.picture === 'string' && token.picture.startsWith('data:image');
      
      return {
        id: token.id,
        name: token.name,
        email: token.email,
        picture: isBase64Image ? undefined : token.picture,
        sub: token.sub,
        role: token.role,
        isActive: token.isActive,
        hasFinalPrediction: token.hasFinalPrediction,
      };
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isActive = token.isActive as boolean;
        session.user.hasFinalPrediction = token.hasFinalPrediction as boolean;
      }
      return session;
    },
  },
});
