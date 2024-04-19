"use server";
import { signIn } from "@/lib/auth";

export default async function signInWithGoogle() {
  await signIn("google");
}
