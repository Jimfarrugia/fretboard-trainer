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
  leftHanded: boolean;
  setLeftHanded: (leftHanded: boolean) => void;
  hardMode: boolean;
  setHardMode: (hardMode: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
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
  leftHanded: defaultSettings.leftHanded,
  setLeftHanded: (leftHanded: boolean) => {},
  hardMode: defaultSettings.hardMode,
  setHardMode: (hardMode: boolean) => {},
  volume: defaultSettings.volume,
  setVolume: (volume: number) => {},
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
  const [leftHanded, setLeftHanded] = useLocalStorageState<boolean>(
    "leftHanded",
    defaultSettings.leftHanded,
  );
  const [hardMode, setHardMode] = useLocalStorageState<boolean>(
    "hardMode",
    defaultSettings.hardMode,
  );
  const [volume, setVolume] = useLocalStorageState<number>(
    "volume",
    defaultSettings.volume,
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
        leftHanded,
        setLeftHanded,
        hardMode,
        setHardMode,
        volume,
        setVolume,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsContext;
