"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchPoints, shouldFlagUniquePredictors } from "@/lib/points";
import { sendApprovalEmail, sendMatchResultEmailsBatch } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { invalidateCache, invalidateCachePattern } from "@/lib/redis";
import type { Stage, GameTime } from "@/lib/constants";

export async function toggleUserActive(userId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  if (typeof userId !== "string" || !userId) throw new Error("Invalid User ID");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
    select: { isActive: true, email: true, name: true, username: true }
  });

  if (updatedUser.isActive && updatedUser.email) {
    const displayName = updatedUser.username || updatedUser.name || "Predictor";
    await sendApprovalEmail(updatedUser.email, displayName);
  }

  await invalidateCache([
    `user:${userId}`,
    'leaderboard_users',
    'total_users'
  ]);
  await invalidateCachePattern('rank:*');

  revalidatePath("/admin");
}

export async function updateMatchResult(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const matchId = formData.get("matchId");
  const scoreA = formData.get("actualScoreA");
  const scoreB = formData.get("actualScoreB");
  const actualGameTimeRaw = formData.get("actualGameTime");

  if (typeof matchId !== "string" || !matchId) throw new Error("Invalid match ID");
  if (typeof scoreA !== "string" || typeof scoreB !== "string") throw new Error("Scores must be strings");

  const actualScoreA = parseInt(scoreA);
  const actualScoreB = parseInt(scoreB);
  const actualGameTime = typeof actualGameTimeRaw === "string" ? actualGameTimeRaw : null;

  if (isNaN(actualScoreA) || isNaN(actualScoreB) || actualScoreA < 0 || actualScoreB < 0) throw new Error("Invalid scores");

  await prisma.match.update({
    where: { id: matchId },
    data: { actualScoreA, actualScoreB, actualGameTime: actualGameTime || null },
  });

  // Automatically calculate points
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { predictions: true },
  });

  if (match) {
    let perfectCount = 0;
    const updates: { id: string; points: number; isPerfect: boolean }[] = [];

    for (const pred of match.predictions) {
      const breakdown = calculateMatchPoints(
        {
          actualScoreA: match.actualScoreA!,
          actualScoreB: match.actualScoreB!,
          actualGameTime: match.actualGameTime as GameTime | null,
          stage: match.stage as Stage,
        },
        {
          predictedScoreA: pred.predictedScoreA,
          predictedScoreB: pred.predictedScoreB,
          predictedGameTime: pred.predictedGameTime as GameTime | null,
        }
      );

      if (breakdown.isPerfectKnockout) perfectCount++;
      updates.push({ id: pred.id, points: breakdown.total, isPerfect: breakdown.isPerfectKnockout });
    }

    const flagUnique = shouldFlagUniquePredictors(perfectCount);

    for (const update of updates) {
      await prisma.prediction.update({
        where: { id: update.id },
        data: {
          pointsAwarded: update.points,
          isUniquePredictorPrize: flagUnique && update.isPerfect,
        },
      });
    }

    // Recalculate total points for all users to self-heal any out-of-sync state
    const allUsersList = await prisma.user.findMany({ select: { id: true } });
    for (const u of allUsersList) {
      const totalResult = await prisma.prediction.aggregate({
        where: { userId: u.id },
        _sum: { pointsAwarded: true },
      });
      await prisma.user.update({
        where: { id: u.id },
        data: { totalPoints: totalResult._sum.pointsAwarded || 0 },
      });
    }

    // Fire and forget batch email
    const allUsers = await prisma.user.findMany({
      where: { isActive: true, email: { not: null } },
      select: { email: true, name: true }
    });
    const validUsers = allUsers as { email: string; name: string | null }[];
    const matchInfo = `Match ${match.matchNumber}: ${match.teamAName} vs ${match.teamBName}`;
    sendMatchResultEmailsBatch(validUsers, matchInfo).catch(console.error);
  }

  await invalidateCache([
    'all_matches',
    'leaderboard_users'
  ]);
  await invalidateCachePattern('user:*');
  await invalidateCachePattern('rank:*');

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath("/dashboard");
}

export async function resetMatchResult(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const matchId = formData.get("matchId");
  if (typeof matchId !== "string" || !matchId) throw new Error("Invalid match ID");

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { predictions: true },
  });

  if (!match) throw new Error("Match not found");

  const isKnockout = match.stage !== "GROUP";

  const updateData: any = {
    actualScoreA: null,
    actualScoreB: null,
    actualGameTime: null,
  };

  if (isKnockout) {
    updateData.teamA = "TBD";
    updateData.teamB = "TBD";
    updateData.teamAName = "TBD";
    updateData.teamBName = "TBD";
  }

  await prisma.match.update({
    where: { id: matchId },
    data: updateData,
  });

  // Reset points for all predictions for this match
  for (const pred of match.predictions) {
    if (pred.pointsAwarded > 0 || pred.isUniquePredictorPrize) {
      await prisma.prediction.update({
        where: { id: pred.id },
        data: {
          pointsAwarded: 0,
          isUniquePredictorPrize: false,
        },
      });
    }
  }

  // Recalculate total points for all users to self-heal any out-of-sync state
  const allUsersList = await prisma.user.findMany({ select: { id: true } });
  for (const u of allUsersList) {
    const totalResult = await prisma.prediction.aggregate({
      where: { userId: u.id },
      _sum: { pointsAwarded: true },
    });
    await prisma.user.update({
      where: { id: u.id },
      data: { totalPoints: totalResult._sum.pointsAwarded || 0 },
    });
  }

  await invalidateCache([
    'all_matches',
    'leaderboard_users'
  ]);
  await invalidateCachePattern('user:*');
  await invalidateCachePattern('rank:*');

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath("/dashboard");
  revalidatePath("/predict/" + matchId);
}

export async function updateMatchTeams(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const matchId = formData.get("matchId");
  const teamA = formData.get("teamA");
  const teamB = formData.get("teamB");
  const teamAName = formData.get("teamAName");
  const teamBName = formData.get("teamBName");

  if (
    typeof matchId !== "string" || !matchId ||
    typeof teamA !== "string" || !teamA ||
    typeof teamB !== "string" || !teamB ||
    typeof teamAName !== "string" || !teamAName ||
    typeof teamBName !== "string" || !teamBName
  ) {
    throw new Error("Missing or invalid required fields");
  }

  await prisma.match.update({
    where: { id: matchId },
    data: { teamA, teamB, teamAName, teamBName },
  });

  await invalidateCache('all_matches');
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/predict/" + matchId);
}



export async function updateUserAmount(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const userId = formData.get("userId");
  const amountPaidRaw = formData.get("amountPaid");

  if (typeof userId !== "string" || !userId || typeof amountPaidRaw !== "string") throw new Error("Invalid data");
  
  const amountPaid = parseInt(amountPaidRaw);
  if (isNaN(amountPaid) || amountPaid < 0) throw new Error("Invalid amount");

  await prisma.user.update({
    where: { id: userId },
    data: { amountPaid },
  });

  await invalidateCache([`user:${userId}`, 'prize_pool']);
  revalidatePath("/admin");
}
