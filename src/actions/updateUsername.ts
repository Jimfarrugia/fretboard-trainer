"use server";
import { db } from "@/lib/db";

// Update the user's username
export default async function updateUsername(userId: string, username: string) {
  return await db.user.update({
    where: { id: userId },
    data: { username },
  });
}
