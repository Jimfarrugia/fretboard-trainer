"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserModal from "./UserModal";
import SignOut from "./SignOut";

export default function HeaderAuth({
  includeUserModal = false,
}: {
  includeUserModal?: boolean;
}) {
  const session = useSession();

  if (includeUserModal) {
    return session?.data?.user ? (
      <>
        <SignOut />
        {session.data.user.name && session.data.user.image && (
          <UserModal
            name={session.data.user.name}
            email={session.data.user.email ?? ""}
            image={session.data.user.image}
            priority
          />
        )}
      </>
    ) : (
      <Link
        href="/auth/signin"
        className="text-light-link underline hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
      >
        Sign in
      </Link>
    );
  } else {
    return session?.data?.user ? (
      <SignOut underline={false} />
    ) : (
      <Link href="/auth/signin">Sign in</Link>
    );
  }
}
