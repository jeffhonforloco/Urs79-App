export interface UserProfile {
  id: string;
  email?: string;
  phoneNumber?: string;
  displayName: string;
  bio: string;
  birthDate: Date;
  gender: string;
  preferences: {
    ageRange: { min: number; max: number };
    genderPreference: string[];
    maxDistance: number;
  };
  photos: string[];
  isVerified: boolean;
  isPremium: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  lastActive: Date;
  interests: string[];
  occupation?: string;
  education?: string;
  languages?: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface UserSettings {
  notifications: {
    matches: boolean;
    messages: boolean;
    likes: boolean;
    inAppVibration: boolean;
    emailNotifications: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showDistance: boolean;
    showLastActive: boolean;
    profileVisibility: 'public' | 'matches-only' | 'private';
  };
  discovery: {
    maxDistance: number;
    ageRange: { min: number; max: number };
    showMe: boolean;
  };
}