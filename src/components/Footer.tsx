import Link from "next/link";

export default function Footer() {
  return (
    <nav className="flex justify-between items-center my-12 text-sm">
      <div>
        <Link
          href="https://jimfarrugia.com.au"
          className="underline hover:text-dark-hover"
        >
          Jim Farrugia
        </Link>
      </div>
      <div className="flex gap-4">
        <Link href="/about" className="underline hover:text-dark-hover">
          About
        </Link>
        <Link href="/tips" className="underline hover:text-dark-hover">
          Tips
        </Link>
        <Link href="/signin" className="underline hover:text-dark-hover">
          Sign In
        </Link>
      </div>
    </nav>
  );
}
