import Link from "next/link";
import Image from "next/image";
import logo from "@/../public/jflogo-white.svg";

export default function Footer() {
  return (
    <footer className="footer footer-center mt-12 rounded bg-light-darkerBg px-4 py-10 dark:bg-dark-darkerBg">
      <nav className="grid grid-flow-col gap-6">
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
      </nav>
      <p>
        <Image src={logo} alt={"123"} className="w-24 dark:opacity-20" />
        <Link
          href="https://jimfarrugia.com.au"
          className="pt-2 text-light-link underline hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover"
        >
          Jim Farrugia
        </Link>
      </p>
    </footer>
  );
}
