import { UserProfile } from '../models/user.model';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateProfile = (profile: Partial<UserProfile>): string[] => {
  const errors: string[] = [];
  
  if (profile.displayName && profile.displayName.length < 2) {
    errors.push('Display name must be at least 2 characters');
  }
  
  if (profile.bio && profile.bio.length > 500) {
    errors.push('Bio must not exceed 500 characters');
  }
  
  return errors;
};