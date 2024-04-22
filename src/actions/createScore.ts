"use server";
import { db } from "@/lib/db";

export async function createScore(
  userId: string,
  score: {
    points: number;
    instrument: string;
    tuning: string;
    timestamp: string;
  },
) {
  try {
    const userScores = await db.score.create({ data: { userId, ...score } });
    return userScores;
  } catch (e) {
    console.error("Failed to create score in database.", e);
  }
}
