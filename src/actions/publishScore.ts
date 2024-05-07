"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Update a score to have 'published: true' so it shows in the leaderboard
// Note: score.timestamp should be provided unless publishing the most recent score
export async function publishScore(
  userId: string,
  username: string,
  timestamp?: string,
) {
  let score;

  // If no timestamp is provided, get the most recent score
  if (!timestamp) {
    score = await db.score.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } else {
    score = await db.score.findFirst({
      where: { userId, timestamp },
    });
  }

  if (!score) {
    throw new Error("No score found.");
  }

  await db.score.update({
    where: { id: score.id },
    data: {
      published: true,
      username,
    },
  });

  // Revalidate to update the leaderboard
  revalidatePath("/");
}
