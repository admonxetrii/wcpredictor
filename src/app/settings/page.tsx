import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true, email: true, image: true, passwordHash: true }
  });

  if (!user) redirect("/auth/signin");

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in-up w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-serif font-bold text-vintage-cream mb-2">Account Settings</h1>
        <p className="text-vintage-cream/60">Manage your profile and security credentials</p>
      </div>

      <SettingsForm 
        username={user.username} 
        email={user.email} 
        image={user.image} 
        hasPassword={!!user.passwordHash} 
      />
    </div>
  );
}
