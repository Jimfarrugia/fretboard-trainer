import { auth } from "@/auth";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import SignOut from "./SignOut";
import { IoSchoolOutline } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";

export default async function Header() {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between pb-6 pt-4 sm:pb-12 sm:pt-8">
      <Link href="/">
        <h1 className="flex items-center gap-2 text-lg font-bold text-light-heading dark:text-dark-heading sm:text-xl">
          <IoSchoolOutline className="text-xl sm:text-2xl" />
          Fretboard Trainer
        </h1>
      </Link>
      <div className="flex items-center gap-2 text-sm sm:gap-6">
        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/about"
            className="text-light-link underline hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
          >
            About
          </Link>
          <Link
            href="/tips"
            className="text-light-link underline hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
          >
            Tips
          </Link>
          {session?.user ? (
              <SignOut />
          ) : (
            <Link
              href="/api/auth/signin"
              className="text-light-link underline hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
            >
              Sign In
            </Link>
          )}
        </div>
        <ThemeToggle />
        <div className="dropdown dropdown-end sm:hidden">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-circle scale-75 border-none bg-light-darkerBg text-light-heading hover:bg-light-link hover:text-light-bg dark:bg-dark-darkerBg dark:text-dark-link hover:dark:bg-dark-hover hover:dark:text-dark-darkerBg"
          >
            <HiOutlineDotsVertical className=" text-xl" />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-30 w-52 rounded-box bg-light-darkerBg p-2 text-light-heading shadow dark:border-2 dark:border-dark-heading dark:bg-dark-darkerBg dark:text-dark-link"
          >
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/tips">Tips</Link>
            </li>
            <li>
              <Link href="/sign-in">Sign in</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
