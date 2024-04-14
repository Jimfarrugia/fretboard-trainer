import signOut from "@/actions/signOut";

export default function SignOut({ underline = true }: { underline?: boolean }) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={`text-light-link ${underline && "underline"} hover:text-light-hover dark:text-dark-link dark:hover:text-dark-hover`}
      >
        Sign Out
      </button>
    </form>
  );
}
