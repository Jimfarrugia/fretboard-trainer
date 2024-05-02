"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md";
import { useOnlineStatus } from "@/lib/hooks";
import UserModal from "./UserModal";
import SignOut from "./SignOut";

export default function HeaderAuth({
  includeUserModal = false,
}: {
  includeUserModal?: boolean;
}) {
  const session = useSession();
  const { isOnline } = useOnlineStatus();

  if (isOnline === undefined) {
    return <p>Loading...</p>;
  }

  // If offline, show an indicator (and tooltip on non-mobile) instead of auth buttons
  if (!isOnline) {
    return (
      <div
        className="tooltip tooltip-left hidden cursor-default [--tooltip-color:theme(colors.light.darkerBg)] [--tooltip-text-color:theme(colors.light.body)] dark:[--tooltip-color:theme(colors.dark.darkerBg)] dark:[--tooltip-text-color:theme(colors.dark.body)] sm:inline-block"
        data-tip="You're offline at the moment. Your scores will be saved as soon as you're back online and signed-in."
      >
        <p className="flex items-center gap-2 text-error">
          <MdSignalWifiConnectedNoInternet0 className="text-lg" />
          <span className="animate-warning-text">Offline</span>
        </p>
      </div>
    );
  }

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
        className="text-light-link underline transition-colors hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
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
