import { createContext, useContext } from "react";
import { Tuning, Instrument } from "@/lib/types";
import { defaultSettings } from "@/lib/constants";
import { useLocalStorageState } from "@/lib/hooks";

interface SettingsContextType {
  instrument: Instrument;
  setInstrument: (instrument: Instrument) => void;
  tuning: Tuning;
  setTuning: (tuning: Tuning) => void;
  enabledStrings: boolean[];
  setEnabledStrings: (enabledStrings: boolean[]) => void;
  sharps: boolean;
  setSharps: (sharps: boolean) => void;
  flats: boolean;
  setFlats: (flats: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  instrument: defaultSettings.instrument,
  setInstrument: (instrument: string) => {},
  tuning: defaultSettings.tuning,
  setTuning: (tuning: Tuning) => {},
  enabledStrings: defaultSettings.enabledStrings,
  setEnabledStrings: (enabledStrings: boolean[]) => {},
  sharps: defaultSettings.sharps,
  setSharps: (sharps: boolean) => {},
  flats: defaultSettings.flats,
  setFlats: (flats: boolean) => {},
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [instrument, setInstrument] = useLocalStorageState<Instrument>(
    "instrument",
    defaultSettings.instrument,
  );
  const [tuning, setTuning] = useLocalStorageState<Tuning>(
    "tuning",
    defaultSettings.tuning,
  );
  const [enabledStrings, setEnabledStrings] = useLocalStorageState<boolean[]>(
    "enabledStrings",
    defaultSettings.enabledStrings,
  );
  const [sharps, setSharps] = useLocalStorageState<boolean>(
    "sharps",
    defaultSettings.sharps,
  );
  const [flats, setFlats] = useLocalStorageState<boolean>(
    "flats",
    defaultSettings.flats,
  );

  return (
    <SettingsContext.Provider
      value={{
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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsContext;
