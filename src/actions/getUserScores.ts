"use server";
import { db } from "@/lib/db";

export async function getUserScores(userId: string) {
  try {
    return await db.score.findMany({ where: { userId } });
  } catch (e) {
    console.error("Failed to find user's scores in database.");
    return [];
  }
}
