import Link from "next/link";

export default function Footer() {
  return (
    <nav className="mt-16 flex items-center justify-between bg-light-darkerBg px-4 py-6 text-sm dark:bg-dark-darkerBg">
      <div>
        <Link
          href="https://jimfarrugia.com.au"
          className="text-light-link underline hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
        >
          Jim Farrugia
        </Link>
      </div>
      <div className="flex gap-4">
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
        <Link
          href="/signin"
          className="text-light-link underline hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
