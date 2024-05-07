"use client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md";
import { useOnlineStatus } from "@/lib/hooks";
import { signInWithGoogle } from "@/actions";
import googleLogo from "@/../public/google-logo.svg";

export default function SignInPage() {
  const session = useSession();
  const { isOnline } = useOnlineStatus();

  if (session.data?.user?.id) {
    redirect("/");
  }

  return (
    <>
      <div className="flex items-center justify-center pb-48 pt-16">
        <div className="w-full space-y-8">
          <div>
            <h2 className="text-center text-2xl font-bold tracking-tight text-light-heading dark:text-dark-heading sm:text-3xl">
              Sign In
            </h2>
          </div>

          <div className="flex flex-col items-center gap-3">
            {isOnline === undefined ? (
              <span className="loading loading-spinner loading-lg text-light-darkerBg dark:text-dark-heading"></span>
            ) : isOnline === false ? (
              <div className="flex flex-col gap-3 text-center">
                <p>
                  <MdSignalWifiConnectedNoInternet0 className="mx-auto text-5xl text-error" />
                </p>
                <p>You are currently offline.</p>
                <p>{"You can sign in when you're back online."}</p>
                <p>
                  <Link
                    className="text-light-link underline transition-colors hover:text-light-hover focus-visible:outline-offset-4 focus-visible:outline-light-link dark:text-dark-link dark:hover:text-dark-hover focus-visible:dark:outline-dark-highlight"
                    href="/"
                  >
                    Go Back
                  </Link>
                </p>
              </div>
            ) : (
              <form action={signInWithGoogle}>
                <button
                  className="flex w-fit gap-3 rounded-lg border border-light-link bg-light-bg px-4 py-2 text-light-link transition-colors hover:border-light-hover hover:text-light-hover focus-visible:outline-offset-4 focus-visible:outline-light-link dark:border-dark-heading dark:bg-dark-darkerBg dark:text-dark-body hover:dark:border-dark-hover hover:dark:text-dark-hover focus-visible:dark:outline-dark-highlight"
                  type="submit"
                >
                  <Image
                    height={24}
                    width={24}
                    src={googleLogo}
                    loading="lazy"
                    alt="google logo"
                  />
                  <span>Sign in with Google</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
