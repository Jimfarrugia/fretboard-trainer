"use server";
import { db } from "@/lib/db";

export async function getTopScores() {
  try {
    const topScores = await db.score.findMany({
      where: { published: true },
      orderBy: { points: "desc" },
    });
    return topScores;
  } catch (e) {
    console.error("Failed to fetch top scores from the database.", e);
  }
}
