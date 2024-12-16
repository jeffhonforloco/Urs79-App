export interface UserMatch {
  id: string;
  users: string[];
  createdAt: Date;
  lastInteraction: Date;
  status: 'pending' | 'matched' | 'unmatched';
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
  matchScore: number;
  commonInterests?: string[];
  isQuickMatch: boolean;
}