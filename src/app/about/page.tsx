export default function AboutPage() {
  return (
    <div className="prose text-light-body dark:text-dark-body">
      <h1 className="text-light-heading dark:text-dark-heading">About</h1>
      <p>
        <em>
          Fretboard Trainer is a game designed to help you find notes on your
          fretboard more quickly.
        </em>
      </p>
      <h2 className="text-light-heading dark:text-dark-heading">
        Improve Your Skills
      </h2>
      <p>
        By using Fretboard Trainer, you should notice over time that you have an
        easier time targeting and quickly finding specific notes while playing
        your instrument. It’s up to you to learn and decide *which* notes you
        should be targeting.
      </p>
      <p>
        Whether you’re writing, improvising, or just learning songs, you should
        see a noticeable improvement in your speed and efficiency with finding
        the notes you’re looking for on your fretboard.
      </p>
      <h2 className="text-light-heading dark:text-dark-heading">
        How it Works
      </h2>
      <p>
        The game is very simple. You’re asked to find a note on the fretboard.
        You have one minute to find as many notes as you can, one at a time.
      </p>
      <p>
        Every correct selection awards 1 point. If you select incorrectly, you
        don’t lose any points, and you can skip the current note if you’d like.
      </p>
      <h2 className="text-light-heading dark:text-dark-heading">
        Customize Your Fretboard
      </h2>
      <p>
        Open up the game’s settings to select your preferred instrument and
        tuning.
      </p>
      <p>
        You can also select whether you’d like to include sharps or flats or
        both or neither.
      </p>
    </div>
  );
}
