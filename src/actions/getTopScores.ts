"use server";
import { db } from "@/lib/db";

export async function getTopScores() {
  try {
    const topScores = await db.score.findMany({
      orderBy: { points: "desc" },
      take: 10, // Get the top 10 scores
    });
    return topScores;
  } catch (e) {
    console.error("Failed to fetch top scores from the database.", e);
  }
}
