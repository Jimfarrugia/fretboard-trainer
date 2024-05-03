export default function TipsPage() {
  return (
    <div className="prose text-light-body dark:text-dark-body">
      <h1 className="text-light-heading dark:text-dark-heading">Tips</h1>
      <iframe
        width="560"
        height="315"
        className="mb-8 h-auto min-h-56 w-full sm:min-h-96"
        src="https://www.youtube.com/embed/kNgpKxHo0H4?si=uUrRfjphJcwWJwK8"
        title=" Memorize the Fretboard in 3 MINUTES!"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <iframe
        width="560"
        height="315"
        className="mb-8 h-auto min-h-56 w-full sm:min-h-96"
        src="https://www.youtube.com/embed/4h2M00lWxBQ?si=PGkiDRzR629ZviPa"
        title="The FRETBOARD memorization HACK"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <h2 className="text-light-heading dark:text-dark-heading">
        Improving with Fretboard Trainer
      </h2>
      <p className="text-light-heading dark:text-dark-heading">
        Here are a few points to help you improve.
      </p>
      <ul>
        <li>Set yourself a goal to work towards.</li>
        <li>Start slow and relax. Give yourself a warm-up round or two.</li>
        <li>
          Notice areas of the fretboard that you are least familiar with and
          practice with them.
        </li>
        <li>
          Use octave shapes to jump from strings you’re more familiar with.
        </li>
        <li>Remember to pick up your instrument and play!</li>
      </ul>
      <h2 className="text-light-heading dark:text-dark-heading">
        Exercises you can do with your instrument
      </h2>
      <ul>
        <li>Play each note twice on each string.</li>
        <li>Practice identifying notes across strings in the same fret.</li>
      </ul>
    </div>
  );
}
