"use server";
import { db } from "@/lib/db";
import { Score } from "@/interfaces";

export async function pushLocalScores(userId: string, localScores: Score[]) {
  try {
    // find all scores in the database where the timestamp matches the timestamp of a locally saved score
    const matchingScores = await db.score.findMany({
      where: {
        userId,
        timestamp: {
          in: localScores.map((localScore: Score) => localScore.timestamp),
        },
      },
    });
    // filter out local scores which have a timestamp that is found in matchingScores
    // also filter out local scores which have a different userId from the current user
    const scoresNotInDatabase = localScores.filter(
      (localScore) =>
        !matchingScores.find(
          (s) => s.timestamp === localScore.timestamp || s.userId !== userId,
        ),
    );
    // if no scores to push, return
    if (!scoresNotInDatabase.length) {
      return;
    }
    // add the userId to each score
    const scoresToPush = scoresNotInDatabase.map((score) => ({
      ...score,
      userId,
    }));
    // push the new scores to the database
    await db.score.createMany({ data: scoresToPush });
  } catch (e) {
    console.error("Failed to push local scores to database...", e);
  }
}
