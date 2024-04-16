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
