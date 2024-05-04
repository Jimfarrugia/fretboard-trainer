import Link from "next/link";
import { HiOutlineDotsVertical } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";
import HeaderAuth from "./HeaderAuth";
import Logo from "./Logo";

export default function Header() {
  return (
    <nav
      data-testid="header-nav"
      className="flex items-center justify-between pb-6 pt-4 sm:pb-12 sm:pt-8"
    >
      <Link
        className="focus-visible:outline-offset-4 focus-visible:outline-light-link focus-visible:dark:outline-dark-highlight"
        tabIndex={0}
        href="/"
      >
        <h1 className="flex items-end gap-2 text-lg font-bold text-light-heading dark:text-dark-heading sm:text-xl">
          <Logo />
          Fretboard Trainer
        </h1>
      </Link>
      <div className="flex items-center gap-2 text-sm sm:gap-6">
        <div
          data-testid="header-nav-links"
          className="hidden items-center gap-6 sm:flex"
        >
          <Link
            href="/about"
            className="text-light-link underline transition-colors hover:text-light-hover focus-visible:outline-offset-4 focus-visible:outline-light-link dark:text-dark-link dark:hover:text-dark-hover focus-visible:dark:outline-dark-highlight"
          >
            About
          </Link>
          <Link
            href="/tips"
            className="text-light-link underline transition-colors hover:text-light-hover focus-visible:outline-offset-4 focus-visible:outline-light-link dark:text-dark-link dark:hover:text-dark-hover focus-visible:dark:outline-dark-highlight"
          >
            Tips
          </Link>
          <HeaderAuth includeUserModal />
        </div>
        <ThemeToggle />
        <div
          data-testid="header-nav-dropdown"
          className="dropdown dropdown-end sm:hidden"
        >
          <div
            data-testid="header-nav-dropdown-button"
            tabIndex={0}
            role="button"
            aria-label="Open dropdown"
            className="btn btn-circle scale-75 border-none bg-light-darkerBg text-light-heading hover:bg-light-link hover:text-light-bg dark:bg-dark-darkerBg dark:text-dark-link hover:dark:bg-dark-hover hover:dark:text-dark-darkerBg"
          >
            <HiOutlineDotsVertical className="text-xl" />
          </div>
          <ul
            data-testid="header-nav-dropdown-links"
            tabIndex={-1}
            className="menu dropdown-content z-30 w-52 rounded-box bg-light-darkerBg p-2 text-light-heading shadow dark:border-2 dark:border-dark-heading dark:bg-dark-darkerBg dark:text-dark-link"
          >
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/tips">Tips</Link>
            </li>
            <li>
              <HeaderAuth />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
