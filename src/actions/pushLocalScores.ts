"use server";
import { db } from "@/lib/db";
import { Score } from "@/interfaces";

export async function pushLocalScores(userEmail: string, scores: Score[]) {
  // get the user from the database
  const user = await db.user.findUnique({
    where: { email: userEmail },
  });

  if (user) {
    const { id: userId } = user;

    // find any scores that are already in the database (timestamp matches)
    const scoresAlreadyInDatabase = await db.score.findMany({
      where: {
        userId,
        timestamp: {
          in: scores.map((score: Score) => score.timestamp),
        },
      },
    });

    // filter out any items from scores which have a timestamp that is found in scoresAlreadyInDatabase
    const scoresNotInDatabase = scores.filter(
      (score) =>
        !scoresAlreadyInDatabase.find((s) => s.timestamp === score.timestamp),
    );

    if (scoresNotInDatabase.length === 0) {
      console.log("no scores to push");
      return;
    }

    // add the user's id to each score
    const scoresToPush = scoresNotInDatabase.map((score) => ({
      ...score,
      userId,
    }));

    console.log("scores to push", scoresToPush);

    // add the new scores to the database
    await db.score.createMany({ data: scoresToPush });
  }
}
