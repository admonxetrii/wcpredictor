import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMatchReminderEmailsBatch } from '@/lib/email';

export async function GET(req: Request) {
  // To secure this endpoint, require a cron secret header
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const now = new Date();
    // Look for matches starting between 65 mins and 1 hour 20 mins (80 mins) from now
    // This perfectly aligns with the 15-minute cron interval to catch every match exactly once.
    const lowerBound = new Date(now.getTime() + 65 * 60000);
    const upperBound = new Date(now.getTime() + 80 * 60000);

    const upcomingMatches = await prisma.match.findMany({
      where: {
        kickoffTime: {
          gt: lowerBound,
          lte: upperBound,
        },
        actualScoreA: null, // hasn't finished
      },
      include: {
        predictions: {
          select: { userId: true }
        }
      }
    });

    let remindersSent = 0;

    for (const match of upcomingMatches) {
      const usersWhoPredicted = new Set(match.predictions.map(p => p.userId));
      
      const usersToRemind = await prisma.user.findMany({
        where: {
          isActive: true,
          email: { not: null },
          id: {
            notIn: Array.from(usersWhoPredicted)
          }
        },
        select: { email: true, name: true }
      });
      const validUsersToRemind = usersToRemind as { email: string; name: string | null }[];

      if (validUsersToRemind.length > 0) {
        const startsInMinutes = Math.round((match.kickoffTime.getTime() - now.getTime()) / 60000);
        const matchInfo = `Match ${match.matchNumber}: ${match.teamAName} vs ${match.teamBName}`;
        
        // Fire and forget batch email
        sendMatchReminderEmailsBatch(validUsersToRemind, matchInfo, startsInMinutes).catch(console.error);
        remindersSent += validUsersToRemind.length;
      }
    }

    return NextResponse.json({ success: true, processedMatches: upcomingMatches.length, remindersSent });
  } catch (error) {
    console.error("Match reminder cron failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
