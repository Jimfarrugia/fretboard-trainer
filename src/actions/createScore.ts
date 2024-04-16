"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
    revalidatePath("/");
    return userScores;
  } catch (e) {
    console.error("Failed to create score in database.", e);
  }
}
