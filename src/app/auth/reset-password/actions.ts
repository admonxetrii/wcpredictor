"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

import { validatePasswordStrength } from "@/lib/password";

export async function resetPassword(formData: FormData) {
  const token = formData.get("token");
  const password = formData.get("password");

  if (typeof token !== "string" || !token) throw new Error("Invalid token");
  if (typeof password !== "string" || !password) throw new Error("Invalid password");

  const passwordError = validatePasswordStrength(password);
  if (passwordError) {
    throw new Error(passwordError);
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    throw new Error("Invalid or expired reset token");
  }

  if (resetToken.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    throw new Error("Reset token has expired");
  }

  const user = await prisma.user.findUnique({
    where: { email: resetToken.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Update password and invalidate token within a transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.delete({
      where: { token },
    })
  ]);

  return { success: true };
}
