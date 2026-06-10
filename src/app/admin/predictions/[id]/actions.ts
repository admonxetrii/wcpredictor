"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function adminSubmitPrediction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const userIdRaw = formData.get("userId");
  const matchIdRaw = formData.get("matchId");
  const scoreARaw = formData.get("predictedScoreA");
  const scoreBRaw = formData.get("predictedScoreB");

  if (typeof userIdRaw !== "string" || !userIdRaw || typeof matchIdRaw !== "string" || !matchIdRaw) {
    throw new Error("Invalid User ID or Match ID");
  }
  if (typeof scoreARaw !== "string" || typeof scoreBRaw !== "string") {
    throw new Error("Scores must be strings");
  }

  const userId = userIdRaw;
  const matchId = matchIdRaw;
  const scoreA = parseInt(scoreARaw, 10);
  const scoreB = parseInt(scoreBRaw, 10);
  
  if (isNaN(scoreA) || isNaN(scoreB) || scoreA < 0 || scoreB < 0 || scoreA > 99 || scoreB > 99) {
    throw new Error("Invalid scores");
  }

  await prisma.prediction.upsert({
    where: {
      userId_matchId: {
        userId,
        matchId
      }
    },
    update: {
      predictedScoreA: scoreA,
      predictedScoreB: scoreB,
    },
    create: {
      userId,
      matchId,
      predictedScoreA: scoreA,
      predictedScoreB: scoreB,
    }
  });

  revalidatePath(`/admin/predictions/${userId}`);
}
