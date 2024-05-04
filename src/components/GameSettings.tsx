import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import { useSettings } from "@/context/SettingsContext";
import { tunings, instruments, defaultSettings } from "@/lib/constants";
import { Instrument } from "@/lib/types";
import { capitalize } from "@/lib/helpers";

export default function GameSettings({
  setIsStartDisabled,
}: {
  setIsStartDisabled: (isStartDisabled: boolean) => void;
}) {
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
    leftHanded,
    setLeftHanded,
    hardMode,
    setHardMode,
  } = useSettings();
  const [error, setError] = useState("");
  const numberOfStrings = tuning.strings.length;

  useEffect(() => {
    // reset enabled strings when instrument changes
    const updatedEnabledStrings = Array.from(
      { length: numberOfStrings },
      () => true,
    );
    setEnabledStrings(updatedEnabledStrings);
  }, [instrument, numberOfStrings, setEnabledStrings]);

  const handleChangeInstrument = (newInstrument: Instrument) => {
    // change to an appropriate tuning when instrument changes
    const newTuning = tunings.find(
      (tuning) => tuning.instrument === newInstrument,
    );
    setTuning(newTuning!);
    setInstrument(newInstrument);
  };

  const handleChangeTuning = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTuningName = e.target.value;
    const selectedTuning = tunings.find(
      (tuning) =>
        tuning.name === selectedTuningName && tuning.instrument === instrument,
    );
    setTuning(selectedTuning!);
  };

  const handleChangeEnabledStrings = (index: number) => {
    setError("");
    setIsStartDisabled(false);
    const updatedEnabledStrings = [...enabledStrings];
    updatedEnabledStrings[index] = !updatedEnabledStrings[index];
    const isAllDisabled =
      updatedEnabledStrings.filter((string) => string === false).length ===
      enabledStrings.length;
    if (isAllDisabled) {
      setError("You can't disable every string.");
      setIsStartDisabled(true);
    }
    setEnabledStrings(updatedEnabledStrings);
  };

  const handleChangeHardMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isHardMode = e.target.checked;
    if (isHardMode) {
      const allStringsEnabled = enabledStrings.map((string) => true);
      setEnabledStrings(allStringsEnabled);
    }
    setHardMode(isHardMode);
  };

  return (
    <>
      {error && (
        <div
          role="alert"
          className="alert alert-error bg-error text-light-bg dark:text-dark-darkerBg"
        >
          <IoIosCloseCircleOutline className="text-2xl" />
          <span>{error}</span>
        </div>
      )}
      <div className="mb-6 mt-2 flex gap-4">
        {/* Instrument */}
        <label className="form-control w-1/2 max-w-xs">
          <div className="label">
            <span className="label-text text-light-heading dark:text-dark-body">
              Instrument
            </span>
          </div>
          <select
            className="select select-bordered border-light-link bg-light-bg text-light-link transition-colors hover:border-light-hover hover:text-light-hover focus:border-light-hover focus:text-light-hover focus:outline-none  focus-visible:outline-light-link dark:border-dark-heading dark:bg-dark-darkerBg dark:text-dark-link hover:dark:border-dark-hover hover:dark:text-dark-hover focus:dark:border-dark-hover focus:dark:text-dark-hover focus-visible:dark:outline-dark-highlight"
            defaultValue={instrument}
            onChange={(e) =>
              handleChangeInstrument(e.target.value as Instrument)
            }
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
            className="select select-bordered border-light-link bg-light-bg text-light-link transition-colors hover:border-light-hover hover:text-light-hover focus:border-light-hover focus:text-light-hover focus:outline-none  focus-visible:outline-light-link dark:border-dark-heading dark:bg-dark-darkerBg dark:text-dark-link hover:dark:border-dark-hover hover:dark:text-dark-hover focus:dark:border-dark-hover focus:dark:text-dark-hover focus-visible:dark:outline-dark-highlight"
            value={tuning.name}
            onChange={(e) => handleChangeTuning(e)}
          >
            {tunings.map((tuning) => {
              return tuning.instrument !== instrument ? null : (
                <option
                  key={`tuning-${tuning.name.split(" ").join()}`}
                  value={tuning.name}
                >
                  {`${tuning.name} (${tuning.strings
                    .slice()
                    .reverse()
                    .map((note) => {
                      const noteWithoutOctaveNumber = note.replace(/\d/g, "");
                      return flats && !sharps
                        ? noteWithoutOctaveNumber.substring(
                            noteWithoutOctaveNumber.length - 2,
                          )
                        : noteWithoutOctaveNumber.substring(0, 2);
                    })
                    .join("-")})`}
                </option>
              );
            })}
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
                disabled={hardMode}
                checked={enabledStrings[i]}
                onChange={(e) => handleChangeEnabledStrings(i)}
                className="h-5 w-5 border-light-link accent-light-link outline-offset-4 outline-light-link dark:accent-dark-highlight dark:outline-dark-highlight sm:h-6 sm:w-6"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Hard Mode */}
      <div className="mb-8 pl-1 text-sm">
        <div className="mb-3 flex items-center">
          <label
            htmlFor="hardMode"
            className="me-2.5 font-medium text-light-heading dark:text-dark-body"
          >
            Hard Mode
          </label>
          <input
            id="hardMode"
            type="checkbox"
            checked={hardMode}
            onChange={(e) => handleChangeHardMode(e)}
            className="toggle bg-light-darkerBg text-light-darkerBg [--tglbg:#ffffff] checked:border-light-link checked:bg-light-link hover:border-light-link hover:bg-light-link focus-visible:outline-light-link dark:bg-dark-heading dark:text-dark-heading dark:[--tglbg:#2C2E31] checked:dark:border-dark-highlight checked:dark:bg-dark-highlight hover:dark:border-dark-body hover:dark:bg-dark-body hover:checked:dark:border-dark-hover hover:checked:dark:bg-dark-hover focus-visible:dark:outline-dark-highlight"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaInfoCircle className="text-lg" />
          <p className="text-sm">
            In hard mode, you need to find each note on a specific string.
          </p>
        </div>
      </div>
      {/* Left-handed mode */}
      <div className="mb-8 flex items-center pl-1 text-sm">
        <label
          htmlFor="leftHanded"
          className="me-2.5 font-medium text-light-heading dark:text-dark-body"
        >
          Left-Handed Mode
        </label>
        <input
          id="leftHanded"
          type="checkbox"
          checked={leftHanded}
          onChange={(e) => setLeftHanded(e.target.checked)}
          className="toggle bg-light-darkerBg text-light-darkerBg [--tglbg:#ffffff] checked:border-light-link checked:bg-light-link hover:border-light-link hover:bg-light-link focus-visible:outline-light-link dark:bg-dark-heading dark:text-dark-heading dark:[--tglbg:#2C2E31] checked:dark:border-dark-highlight checked:dark:bg-dark-highlight hover:dark:border-dark-body hover:dark:bg-dark-body hover:checked:dark:border-dark-hover hover:checked:dark:bg-dark-hover focus-visible:dark:outline-dark-highlight"
        />
      </div>
      {/* Accidentals */}
      <div className="mb-8 flex items-center pl-1 text-sm">
        <label
          htmlFor="sharps"
          className="me-2.5 font-medium text-light-heading dark:text-dark-body"
        >
          Use Sharps (#)
        </label>
        <input
          id="sharps"
          type="checkbox"
          checked={sharps}
          onChange={(e) => setSharps(e.target.checked)}
          className="toggle bg-light-darkerBg text-light-darkerBg [--tglbg:#ffffff] checked:border-light-link checked:bg-light-link hover:border-light-link hover:bg-light-link focus-visible:outline-light-link dark:bg-dark-heading dark:text-dark-heading dark:[--tglbg:#2C2E31] checked:dark:border-dark-highlight checked:dark:bg-dark-highlight hover:dark:border-dark-body hover:dark:bg-dark-body hover:checked:dark:border-dark-hover hover:checked:dark:bg-dark-hover focus-visible:dark:outline-dark-highlight"
        />
      </div>
      <div className="mb-2 flex items-center pl-1 text-sm">
        <label
          htmlFor="flats"
          className="me-2.5 font-medium text-light-heading dark:text-dark-body"
        >
          Use Flats (b)
        </label>
        <input
          id="flats"
          type="checkbox"
          checked={flats}
          onChange={(e) => setFlats(e.target.checked)}
          className="toggle bg-light-darkerBg text-light-darkerBg [--tglbg:#ffffff] checked:border-light-link checked:bg-light-link hover:border-light-link hover:bg-light-link focus-visible:outline-light-link dark:bg-dark-heading dark:text-dark-heading dark:[--tglbg:#2C2E31] checked:dark:border-dark-highlight checked:dark:bg-dark-highlight hover:dark:border-dark-body hover:dark:bg-dark-body hover:checked:dark:border-dark-hover hover:checked:dark:bg-dark-hover focus-visible:dark:outline-dark-highlight"
        />
      </div>
    </>
  );
}
