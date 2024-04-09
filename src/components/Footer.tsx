import Link from "next/link";

export default function Footer() {
  return (
    <nav className="flex justify-between items-center mt-16 px-4 py-6 text-sm bg-light-darkerBg dark:bg-dark-darkerBg">
      <div>
        <Link
          href="https://jimfarrugia.com.au"
          className="underline text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
        >
          Jim Farrugia
        </Link>
      </div>
      <div className="flex gap-4">
        <Link
          href="/about"
          className="underline text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
        >
          About
        </Link>
        <Link
          href="/tips"
          className="underline text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
        >
          Tips
        </Link>
        <Link
          href="/signin"
          className="underline text-light-link hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
