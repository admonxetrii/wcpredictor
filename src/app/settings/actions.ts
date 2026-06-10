"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { validatePasswordStrength } from "@/lib/password";
import { invalidateCache } from "@/lib/redis";

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");

  const currentPasswordRaw = formData.get("currentPassword");
  const newPasswordRaw = formData.get("newPassword");
  const confirmPasswordRaw = formData.get("confirmPassword");

  if (typeof newPasswordRaw !== "string" || typeof confirmPasswordRaw !== "string") {
    throw new Error("Invalid password data");
  }

  const currentPassword = typeof currentPasswordRaw === "string" ? currentPasswordRaw : null;
  const newPassword = newPasswordRaw;
  const confirmPassword = confirmPasswordRaw;

  if (user.passwordHash) {
    if (!currentPassword) throw new Error("Current password is required");
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) throw new Error("Incorrect current password");
  }

  const passwordError = validatePasswordStrength(newPassword);
  if (passwordError) {
    throw new Error(passwordError);
  }
  
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  revalidatePath("/settings");
}

export async function updateAvatar(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const image = formData.get("image");
  if (typeof image !== "string" || !image) throw new Error("Image is required");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image },
  });

  await invalidateCache([
    `user:${session.user.id}`,
    'leaderboard_users'
  ]);

  revalidatePath("/settings");
  revalidatePath("/leaderboard");
  revalidatePath("/dashboard");
}

export async function setUsername(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const username = formData.get("username");
  if (typeof username !== "string" || !username || username.trim().length < 5 || username.trim().length > 30) {
    throw new Error("Username must be between 5 and 30 characters and alphanumeric only");
  }
  if (!/^[a-zA-Z0-9]+$/.test(username.trim())) {
    throw new Error("Username must contain only letters and numbers");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.username) throw new Error("Username is already set");

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) throw new Error("Username is already taken");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username },
  });

  await invalidateCache([
    `user:${session.user.id}`,
    'leaderboard_users'
  ]);

  revalidatePath("/settings");
  revalidatePath("/leaderboard");
  revalidatePath("/dashboard");
}
