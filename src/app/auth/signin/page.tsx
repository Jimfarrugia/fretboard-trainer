import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import signInWithGoogle from "@/actions/signInWithGoogle";
import googleLogo from "@/../public/google-logo.svg";

export default async function SignInPage() {
  const session = await auth();

  if (session) {
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
            <form action={signInWithGoogle}>
              <button
                className="flex w-fit gap-3 rounded-lg border bg-light-bg px-4 py-2 text-light-body transition duration-150 hover:shadow dark:border-dark-heading dark:bg-dark-darkerBg dark:text-dark-body"
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
          </div>
        </div>
      </div>
    </>
  );
}
