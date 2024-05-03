import { BiError } from "react-icons/bi";
import History from "@/components/History";
import Leaderboard from "@/components/Leaderboard";
import Game from "@/components/Game";
import { getTopScores } from "@/actions/getTopScores";

export default async function Home() {
  const topScores = await getTopScores();
  return (
    <main>
      <noscript>
        <div
          role="alert"
          className="alert alert-error mb-6 bg-error text-dark-darkerBg"
        >
          <BiError className="text-4xl" />
          <span>
            <span className="font-bold">
              Scripts are disabled in your browser.{" "}
            </span>
            <br />
            This app will not work unless JavaScript is enabled.
          </span>
        </div>
      </noscript>
      <Game />
      <History />
      <Leaderboard topScores={topScores} />
    </main>
  );
}
