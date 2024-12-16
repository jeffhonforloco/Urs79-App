import { Observable } from '@nativescript/core';
import { MatchingService } from '../../services/matching.service';
import { UserProfile } from '../../models/user.model';
import { getCurrentLocation } from '../../utils/geolocation';

export class MatchesViewModel extends Observable {
    private matchingService: MatchingService;
    public currentProfile: UserProfile | null = null;
    public potentialMatches: UserProfile[] = [];
    private currentIndex = 0;

    constructor() {
        super();
        this.matchingService = new MatchingService();
        this.loadPotentialMatches();
    }

    private async loadPotentialMatches() {
        try {
            const location = await getCurrentLocation();
            const userId = firebase().auth().currentUser?.uid;
            if (!userId) return;

            const matches = await this.matchingService.getPotentialMatches(userId, {
                ageRange: { min: 18, max: 99 },
                genderPreference: ['all'],
                maxDistance: 50
            });

            this.potentialMatches = matches;
            this.showNextProfile();
        } catch (error) {
            console.error('Error loading matches:', error);
        }
    }

    private showNextProfile() {
        if (this.currentIndex < this.potentialMatches.length) {
            this.currentProfile = this.potentialMatches[this.currentIndex];
            this.notifyPropertyChange('currentProfile', this.currentProfile);
            this.currentIndex++;
        } else {
            this.loadPotentialMatches(); // Reload when we run out
        }
    }

    async onLike() {
        if (!this.currentProfile) return;
        const userId = firebase().auth().currentUser?.uid;
        if (!userId) return;

        await this.matchingService.createMatch(userId, this.currentProfile.id);
        this.showNextProfile();
    }

    onReject() {
        this.showNextProfile();
    }

    async onQuickMatch() {
        const userId = firebase().auth().currentUser?.uid;
        if (!userId) return;

        await this.matchingService.quickMatch(userId);
    }
}