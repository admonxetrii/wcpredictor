"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validatePasswordStrength } from "@/lib/password";
import { sendRegistrationEmail } from "@/lib/email";

export async function setFinalWinner(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const team = formData.get("team");
  const username = formData.get("username");
  const password = formData.get("password");

  if (typeof team !== "string" || !team) throw new Error("Must select a team");
  if (typeof username !== "string" || username.trim().length < 5 || username.trim().length > 30) {
    throw new Error("Username must be between 5 and 30 characters and alphanumeric only");
  }
  if (!/^[a-zA-Z0-9]+$/.test(username.trim())) {
    throw new Error("Username must contain only letters and numbers");
  }
  if (typeof password !== "string" || !password) throw new Error("Password is required");
  
  const passwordError = validatePasswordStrength(password);
  if (passwordError) throw new Error(passwordError);

  // Check username uniqueness
  const existingUser = await prisma.user.findUnique({
    where: { username: username.trim() }
  });
  if (existingUser && existingUser.id !== session.user.id) {
    throw new Error("Username is already taken");
  }

  // Only allow setting once
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { finalWinnerPrediction: true },
  });

  if (user?.finalWinnerPrediction) {
    throw new Error("Final winner prediction already set");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: { 
      finalWinnerPrediction: team,
      username: username.trim(),
      passwordHash: passwordHash
    },
    select: { email: true, name: true, username: true }
  });

  if (updatedUser.email) {
    const displayName = updatedUser.username || updatedUser.name || "Predictor";
    await sendRegistrationEmail(updatedUser.email, displayName);
  }

  return { success: true };
}
