"use server";
import { db } from "@/lib/db";

export async function getUserScores(userEmail: string) {
  const userWithScores = await db.user.findUnique({
    where: { email: userEmail },
    include: { scores: true },
  });
  if (!userWithScores) {
    throw new Error("User does not exist in the database.");
  }
  return userWithScores.scores;
}
