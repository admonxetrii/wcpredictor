import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminTabs from "@/components/admin/AdminTabs";
import UserManagement from "@/components/admin/UserManagement";
import MatchManagement from "@/components/admin/MatchManagement";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/dashboard");

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "nishamwagle@gmail.com";

  const users = await prisma.user.findMany({
    where: {
      email: { not: superAdminEmail }
    },
    orderBy: { createdAt: "desc" },
  });

  const matches = await prisma.match.findMany({
    orderBy: [{ kickoffTime: "asc" }, { matchNumber: "asc" }],
    include: { _count: { select: { predictions: true } } }
  });

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-12 overflow-x-hidden">
      <div className="mb-8 border-b border-vintage-gold/20 pb-4">
        <h1 className="text-4xl font-serif font-bold text-vintage-cream">Admin Control Panel</h1>
      </div>

      <AdminTabs 
        usersContent={<UserManagement users={users} />}
        matchesContent={<MatchManagement matches={matches} />}
      />
    </div>
  );
}
