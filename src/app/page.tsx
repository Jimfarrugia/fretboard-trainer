import History from "@/components/History";
import Leaderboard from "@/components/Leaderboard";
import Game from "@/components/Game";
import { getTopScores } from "@/actions/getTopScores";

export default async function Home() {
  const topScores = await getTopScores();
  return (
    <main>
      <Game />
      <History />
      <Leaderboard topScores={topScores} />
    </main>
  );
}
