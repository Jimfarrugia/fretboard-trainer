import { auth } from "@/auth";
import History from "@/components/History";
import Leaderboard from "@/components/Leaderboard";
import Game from "@/components/Game";
import { getUserScores } from "@/actions/getUserScores";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;
  const userScores = userId ? await getUserScores(userId) : [];

  return (
    <main>
      <Game />
      <History userScores={userScores} />
      <Leaderboard />
    </main>
  );
}
