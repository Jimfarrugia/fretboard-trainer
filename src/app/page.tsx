import History from "@/components/History";
import Leaderboard from "@/components/Leaderboard";
import Game from "@/components/Game";

export default function Home() {
  return (
    <main>
      <Game />
      <History />
      <Leaderboard />
    </main>
  );
}
