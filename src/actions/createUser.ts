"use server";
import { db } from "@/lib/db";

export async function createUser({
  name,
  email,
  image,
}: {
  name?: string;
  email?: string;
  image?: string;
}) {
  if (!email) {
    throw new Error("Email is required.");
  }
  const userExists = await db.user.findUnique({
    where: { email },
  });
  if (!userExists) {
    await db.user.create({
      data: { email: email!, name, image },
    });
  }
}
