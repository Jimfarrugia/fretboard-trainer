"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { Score } from "@/lib/types";

export default async function deleteScore(userId: string, score: Score) {
  try {
    const { timestamp } = score;

    await db.score.deleteMany({ where: { userId, timestamp } });

    if (score.published) {
      // Revalidate to update the leaderboard
      revalidatePath("/");
    }
  } catch (e) {
    console.error("Failed to delete the score in the database.", e);
  }
}
