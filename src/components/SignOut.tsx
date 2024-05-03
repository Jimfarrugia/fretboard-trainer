import signOut from "@/actions/signOut";

export default function SignOut({ underline = true }: { underline?: boolean }) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={`text-light-link ${underline && "underline"} rounded-sm transition-colors hover:text-light-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-light-link dark:text-dark-link dark:hover:text-dark-hover focus-visible:dark:outline-dark-highlight`}
      >
        Sign Out
      </button>
    </form>
  );
}
