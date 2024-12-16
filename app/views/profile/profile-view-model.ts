import { Observable } from '@nativescript/core';
import { ProfileService } from '../../services/profile.service';
import { UserProfile } from '../../models/user.model';
import { validateProfile } from '../../utils/validation';

export class ProfileViewModel extends Observable {
    private profileService: ProfileService;
    public displayName: string = '';
    public bio: string = '';
    public ageRange: { min: number; max: number } = { min: 18, max: 35 };
    public profilePhoto: string = '';

    constructor() {
        super();
        this.profileService = new ProfileService();
        this.loadProfile();
    }

    private async loadProfile() {
        const userId = firebase().auth().currentUser?.uid;
        if (!userId) return;

        try {
            const doc = await firebase().firestore()
                .collection('users')
                .doc(userId)
                .get();
            
            const profile = doc.data() as UserProfile;
            this.displayName = profile.displayName;
            this.bio = profile.bio;
            this.ageRange = profile.preferences.ageRange;
            this.profilePhoto = profile.photos[0] || '';

            this.notifyPropertyChange('displayName', this.displayName);
            this.notifyPropertyChange('bio', this.bio);
            this.notifyPropertyChange('ageRange', this.ageRange);
            this.notifyPropertyChange('profilePhoto', this.profilePhoto);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    async onChangePhoto() {
        // Implement photo picker logic
        const userId = firebase().auth().currentUser?.uid;
        if (!userId) return;

        try {
            // Add photo picker implementation
            const photoPath = ''; // Get from photo picker
            const photoUrl = await this.profileService.uploadProfilePhoto(userId, photoPath);
            this.profilePhoto = photoUrl;
            this.notifyPropertyChange('profilePhoto', this.profilePhoto);
        } catch (error) {
            console.error('Error changing photo:', error);
        }
    }

    async onSaveProfile() {
        const userId = firebase().auth().currentUser?.uid;
        if (!userId) return;

        const profile: Partial<UserProfile> = {
            displayName: this.displayName,
            bio: this.bio,
            preferences: {
                ageRange: this.ageRange,
                genderPreference: ['all'],
                maxDistance: 50
            }
        };

        const errors = validateProfile(profile);
        if (errors.length > 0) {
            // Handle validation errors
            return;
        }

        try {
            await this.profileService.updateProfile(userId, profile);
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    }
}