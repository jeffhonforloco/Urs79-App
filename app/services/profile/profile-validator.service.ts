import { UserProfile } from '../../models/user.model';

export class ProfileValidatorService {
  static validateProfile(profile: Partial<UserProfile>): string[] {
    const errors: string[] = [];

    if (profile.displayName) {
      if (profile.displayName.length < 2) {
        errors.push('Display name must be at least 2 characters long');
      }
      if (profile.displayName.length > 50) {
        errors.push('Display name cannot exceed 50 characters');
      }
    }

    if (profile.bio) {
      if (profile.bio.length > 500) {
        errors.push('Bio cannot exceed 500 characters');
      }
    }

    if (profile.birthDate) {
      const age = this.calculateAge(profile.birthDate);
      if (age < 18) {
        errors.push('Must be at least 18 years old');
      }
      if (age > 100) {
        errors.push('Invalid birth date');
      }
    }

    return errors;
  }

  private static calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}