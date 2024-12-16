import { firebase } from '@nativescript/firebase-core';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    PhoneAuthProvider,
    sendPasswordResetEmail
} from '@nativescript/firebase-auth';
import { hashPassword } from '../utils/security';

export class AuthService {
    async signUpWithEmail(email: string, password: string) {
        try {
            const hashedPassword = hashPassword(password);
            const userCredential = await createUserWithEmailAndPassword(email, hashedPassword);
            await this.createUserProfile(userCredential.user.uid, { email });
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    async signInWithEmail(email: string, password: string) {
        try {
            const hashedPassword = hashPassword(password);
            const userCredential = await signInWithEmailAndPassword(email, hashedPassword);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    async signInWithPhone(phoneNumber: string) {
        try {
            const provider = new PhoneAuthProvider();
            const verificationId = await provider.verifyPhoneNumber(phoneNumber);
            return verificationId;
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(email: string) {
        try {
            await sendPasswordResetEmail(email);
        } catch (error) {
            throw error;
        }
    }

    private async createUserProfile(userId: string, data: any) {
        await firebase().firestore()
            .collection('users')
            .doc(userId)
            .set({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                isVerified: false,
                isPremium: false
            });
    }
}