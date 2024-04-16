"use server";
import { db } from "@/lib/db";
import { Score } from "@/interfaces";
import { revalidatePath } from "next/cache";

export async function pushLocalScores(userId: string, localScores: Score[]) {
  try {
    // Find all scores in the database where the timestamp matches the timestamp of a locally saved score
    const matchingScores = await db.score.findMany({
      where: {
        userId,
        timestamp: {
          in: localScores.map((localScore: Score) => localScore.timestamp),
        },
      },
    });
    // Filter-out local scores which are already in the database or owned by another user
    const scoresNotInDatabase = localScores.filter((localScore) => {
      // Check if score timestamp is equal to any timestamp found in matchingScores
      const timestampMatches = matchingScores.some(
        (matchingScore) => matchingScore.timestamp === localScore.timestamp,
      );
      // Check if userId matches current user
      const userIdMatches = localScore.userId === userId;
      // Keep the scores if timestamp is unique and userId matches current user or if there is no userId in localScore
      return !timestampMatches && (userIdMatches || !localScore.userId);
    });
    // If no scores to push, return
    if (!scoresNotInDatabase.length) {
      return;
    }
    // Add the userId to each score
    const scoresToPush = scoresNotInDatabase.map((score) => ({
      ...score,
      userId,
    }));
    // Push the new scores to the database
    await db.score.createMany({ data: scoresToPush });
    // Update the frontend to show the pushed scores
    revalidatePath("/");
  } catch (e) {
    console.error("Failed to push local scores to database...", e);
  }
}
