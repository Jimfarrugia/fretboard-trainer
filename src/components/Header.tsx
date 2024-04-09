import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <nav className="flex justify-between items-center my-6">
      <Link href="/">
        <h1 className="font-bold text-xl text-dark-heading">
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
