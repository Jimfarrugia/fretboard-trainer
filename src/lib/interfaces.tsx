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
}

export interface Tuning {
  name: string;
  notes: string[];
}

export type Instrument = (typeof instruments)[number];