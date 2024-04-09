import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { IoSchoolOutline } from "react-icons/io5";

export default function Header() {
  return (
    <nav className="flex justify-between items-center my-6">
      <Link href="/">
        <h1 className="flex items-center gap-2 font-bold text-xl text-light-heading dark:text-dark-heading">
          <IoSchoolOutline className="text-2xl" />
          Fretboard Trainer
        </h1>
      </Link>
      <div className="flex gap-4 text-sm">
        <Link href="/about" className="underline hover:text-dark-hover">
          About
        </Link>
        <Link href="/tips" className="underline hover:text-dark-hover">
          Tips
        </Link>
        <Link href="/signin" className="underline hover:text-dark-hover">
          Sign In
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
