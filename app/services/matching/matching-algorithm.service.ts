import { UserProfile } from '../../models/user.model';
import { calculateDistance } from '../../utils/geolocation';

export class MatchingAlgorithmService {
  static calculateMatchScore(user1: UserProfile, user2: UserProfile): number {
    let score = 0;
    const maxScore = 100;

    // Location score (30%)
    const distance = calculateDistance(
      user1.location.latitude,
      user1.location.longitude,
      user2.location.latitude,
      user2.location.longitude
    );
    const locationScore = Math.max(0, 30 - (distance / 2)); // Decrease score with distance

    // Age preference score (25%)
    const ageScore = this.calculateAgeScore(user1, user2);

    // Interest match score (25%)
    const interestScore = this.calculateInterestScore(user1, user2);

    // Activity score (20%)
    const activityScore = this.calculateActivityScore(user2);

    score = locationScore + ageScore + interestScore + activityScore;
    return Math.min(score, maxScore);
  }

  private static calculateAgeScore(user1: UserProfile, user2: UserProfile): number {
    const age2 = this.calculateAge(user2.birthDate);
    if (age2 >= user1.preferences.ageRange.min && 
        age2 <= user1.preferences.ageRange.max) {
      return 25;
    }
    return 0;
  }

  private static calculateInterestScore(user1: UserProfile, user2: UserProfile): number {
    // Implementation of interest matching logic
    return 25;
  }

  private static calculateActivityScore(user: UserProfile): number {
    const daysSinceLastActive = (Date.now() - user.lastActive.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 20 - (daysSinceLastActive * 2));
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