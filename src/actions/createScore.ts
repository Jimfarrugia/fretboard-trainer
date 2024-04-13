"use server";
import { db } from "@/lib/db";

export async function createScore(
  userEmail: string,
  score: {
    points: number;
    instrument: string;
    tuning: string;
    timestamp: string;
  },
) {
  const user = await db.user.findUnique({
    where: { email: userEmail },
  });
  if (!user) {
    throw new Error("User does not exist in the database.");
  }
  await db.score.create({ data: { userId: user.id, ...score } });
}
