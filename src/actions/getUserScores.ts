"use server";
import { db } from "@/lib/db";

export default async function getUserScores(userId: string) {
  try {
    const userScores = await db.score.findMany({ where: { userId } });
    return userScores;
  } catch (e) {
    console.error("Failed to find user's scores in database.");
    return [];
  }
}
