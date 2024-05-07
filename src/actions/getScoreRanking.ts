"use server";
import { db } from "@/lib/db";

export default async function getScoreRanking(points: number) {
  try {
    // Get all published scores in order of highest points
    const scores = await db.score.findMany({
      where: { published: true },
      orderBy: { points: "desc" },
    });

    if (!scores) {
      throw new Error("No scores found.");
    }

    // Create a set of points values
    const sortedPoints = scores.map((obj) => obj.points).sort((a, b) => b - a);
    const pointsSet = new Set(sortedPoints);
    const uniquePoints = Array.from(pointsSet);

    // Find the number of points values higher than the given points value
    const higherPoints = uniquePoints.filter((p: number) => p > points).length;

    return higherPoints + 1;
  } catch (e) {
    console.error("Failed to get score ranking.", e);
  }
}
