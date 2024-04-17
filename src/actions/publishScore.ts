"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Update the user's most recent score to published=true and add the username
export async function publishScore(userId: string, username: string) {
  const score = await db.score.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!score) {
    throw new Error("No score found.");
  }

  await db.score.update({
    where: { id: score.id },
    data: {
      published: true,
      username,
    },
  });

  revalidatePath("/");
}
