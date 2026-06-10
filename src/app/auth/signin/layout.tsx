import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SignInLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (session?.user) {
    if (!session.user.hasFinalPrediction && session.user.role !== "ADMIN") {
      redirect("/register");
    }
    if (!session.user.isActive && session.user.role !== "ADMIN") {
      redirect("/auth/error?error=AccessDenied");
    }
    redirect("/dashboard");
  }
  
  return <>{children}</>;
}
