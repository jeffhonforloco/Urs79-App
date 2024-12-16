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
}