"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isMatchLocked } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { invalidateCache } from "@/lib/redis";

export async function submitPrediction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  // Verify DB user is active
  const user = await prisma.user.findUnique({where: {id: session.user.id}});
  if (!user?.isActive) throw new Error("Account pending approval");

  const matchIdRaw = formData.get("matchId");
  const scoreARaw = formData.get("predictedScoreA");
  const scoreBRaw = formData.get("predictedScoreB");
  const predictedGameTimeRaw = formData.get("predictedGameTime");

  if (typeof matchIdRaw !== "string" || !matchIdRaw) throw new Error("Invalid match ID");
  if (typeof scoreARaw !== "string" || typeof scoreBRaw !== "string") throw new Error("Scores must be strings");

  const matchId = matchIdRaw;
  const predictedScoreA = parseInt(scoreARaw);
  const predictedScoreB = parseInt(scoreBRaw);
  const predictedGameTime = typeof predictedGameTimeRaw === "string" ? predictedGameTimeRaw : null;

  // Validate
  if (isNaN(predictedScoreA) || isNaN(predictedScoreB)) throw new Error("Invalid scores");
  if (predictedScoreA < 0 || predictedScoreB < 0 || predictedScoreA > 99 || predictedScoreB > 99) throw new Error("Scores must be valid numbers between 0 and 99");

  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) throw new Error("Match not found");
  if (isMatchLocked(match.kickoffTime)) throw new Error("Predictions are locked for this match");
  if (match.actualScoreA !== null) throw new Error("Match has already finished");
  if (match.teamA === "TBD" || match.teamB === "TBD") throw new Error("Teams are not yet finalized for this match");

  // Upsert prediction
  await prisma.prediction.upsert({
    where: {
      userId_matchId: {
        userId: session.user.id,
        matchId: matchId,
      },
    },
    update: {
      predictedScoreA,
      predictedScoreB,
      predictedGameTime: predictedGameTime || null,
    },
    create: {
      userId: session.user.id,
      matchId: matchId,
      predictedScoreA,
      predictedScoreB,
      predictedGameTime: predictedGameTime || null,
    },
  });

  await invalidateCache(`user:${session.user.id}`);

  revalidatePath("/dashboard");
  revalidatePath("/predict/" + matchId);
}
