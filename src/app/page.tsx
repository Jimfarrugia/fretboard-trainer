import { auth } from "@/auth";
import History from "@/components/History";
import Leaderboard from "@/components/Leaderboard";
import Game from "@/components/Game";
import { getUserScores } from "@/actions/getUserScores";

export default async function Home() {
  const session = await auth();
  const userScores = session
    ? await getUserScores(session?.user?.email || "")
    : [];

  return (
    <main>
      <Game />
      <History userScores={userScores} />
      <Leaderboard />
    </main>
  );
}
