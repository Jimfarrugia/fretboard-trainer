import { instruments } from "@/lib/constants";

export interface Score {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  points: number;
  instrument: string;
  tuning: string;
  timestamp: string;
  published?: boolean;
  username?: string | null;
  userId?: string;
  hardMode: boolean;
}

export interface Tuning {
  name: string;
  instruments: Instrument[];
  strings: string[];
}

export type Instrument = (typeof instruments)[number];

export interface ScoreFilters {
  [key: string]: boolean;
}
