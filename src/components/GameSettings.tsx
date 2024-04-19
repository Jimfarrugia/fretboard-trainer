import { useSettings } from "@/context/SettingsContext";
import { tunings, instruments } from "@/lib/constants";
import { Instrument } from "@/lib/types";
import { capitalize } from "@/lib/helpers";

export default function GameSettings() {
  const {
    instrument,
    setInstrument,
    tuning,
    setTuning,
    enabledStrings,
    setEnabledStrings,
    sharps,
    setSharps,
    flats,
    setFlats,
  } = useSettings();

  const handleChangeTuning = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTuningName = e.target.value;
    const selectedTuning = tunings.find(
      (tuning) => tuning.name === selectedTuningName,
    );
    setTuning(selectedTuning!);
  };

  const handleChangeEnabledStrings = (index: number) => {
    const updatedEnabledStrings = [...enabledStrings];
    updatedEnabledStrings[index] = !updatedEnabledStrings[index];
    setEnabledStrings(updatedEnabledStrings);
  };

  return (
    <>
      <div className="mb-6 mt-2 flex gap-4">
        {/* Instrument */}
        <label className="form-control w-1/2 max-w-xs">
          <div className="label">
            <span className="label-text text-light-heading dark:text-dark-body">
              Instrument
            </span>
          </div>
          <select
            className="select select-bordered border-light-link bg-light-bg text-light-link hover:border-light-hover hover:text-light-hover focus:outline-light-link dark:border-dark-heading dark:bg-dark-darkerBg dark:text-dark-link dark:outline-dark-highlight hover:dark:border-dark-hover hover:dark:text-dark-hover"
            defaultValue={instrument}
            onChange={(e) => setInstrument(e.target.value as Instrument)}
          >
            {instruments.map((instrument) => (
              <option key={`instrument-${instrument}`} value={instrument}>
                {capitalize(instrument)}
              </option>
            ))}
          </select>
        </label>
        {/* Tuning */}
        <label className="form-control w-1/2 max-w-xs">
          <div className="label">
            <span className="label-text text-light-heading dark:text-dark-body">
              Tuning
            </span>
          </div>
          <select
            className="select select-bordered border-light-link bg-light-bg text-light-link hover:border-light-hover hover:text-light-hover focus:outline-light-link dark:border-dark-heading dark:bg-dark-darkerBg dark:text-dark-link dark:outline-dark-highlight hover:dark:border-dark-hover hover:dark:text-dark-hover"
            defaultValue={tuning.name}
            onChange={(e) => handleChangeTuning(e)}
          >
            {tunings.map((tuning) => (
              <option
                key={`tuning-${tuning.name.split(" ").join()}`}
                value={tuning.name}
              >
                {tuning.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {/* Strings */}
      <div className="mb-8">
        <div className="label">
          <span className="label-text mb-1.5 text-light-heading dark:text-dark-body">
            Strings to Practice
          </span>
        </div>
        <div className="ml-1 flex items-center gap-3 text-sm sm:gap-6 sm:text-base">
          {Array.from(
            { length: enabledStrings.length },
            (_, index) => index,
          ).map((v, i) => (
            <div className="flex items-center" key={`string-${i + 1}`}>
              <label htmlFor={`string-${i + 1}`} className="me-1.5 sm:me-2.5">
                {i + 1}
              </label>
              <input
                id={`string-${i + 1}`}
                type="checkbox"
                checked={enabledStrings[i]}
                onChange={(e) => handleChangeEnabledStrings(i)}
                className="h-5 w-5 accent-light-link dark:accent-dark-highlight sm:h-6 sm:w-6"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Accidentals */}
      <div className="mb-8 flex items-center pl-1 text-sm">
        <label
          htmlFor="sharps"
          className="me-2.5 text-light-heading dark:text-dark-body"
        >
          Use Sharps (#)
        </label>
        <input
          id="sharps"
          type="checkbox"
          checked={sharps}
          onChange={(e) => setSharps(e.target.checked)}
          className="h-5 w-5 accent-light-link dark:accent-dark-highlight sm:h-6 sm:w-6"
        />
      </div>
      <div className="mb-2 flex items-center pl-1 text-sm">
        <label
          htmlFor="flats"
          className="me-2.5 text-light-heading dark:text-dark-body"
        >
          Use Flats (b)
        </label>
        <input
          id="flats"
          type="checkbox"
          checked={flats}
          onChange={(e) => setFlats(e.target.checked)}
          className="h-5 w-5 accent-light-link dark:accent-dark-highlight sm:h-6 sm:w-6"
        />
      </div>
    </>
  );
}
