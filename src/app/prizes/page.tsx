import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCached } from "@/lib/redis";
import PrizesClient from "./PrizesClient";

export default async function PrizesPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");
  if (!session.user.isActive && session.user.role !== "ADMIN") {
    redirect("/auth/error?error=AccessDenied");
  }

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "nishamwagle@gmail.com";

  // Calculate total prize pool
  const result = await getCached('prize_pool', () => prisma.user.aggregate({
    where: {
      email: { not: superAdminEmail }
    },
    _sum: { amountPaid: true }
  }));
  
  const totalCollected = result._sum.amountPaid || 0;

  return <PrizesClient totalCollected={totalCollected} />;
}
