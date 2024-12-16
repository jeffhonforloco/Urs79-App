import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { validateEmail, validatePhone } from '../../utils/validation';

export class SignupViewModel extends Observable {
    private authService: AuthService;
    public email: string = '';
    public phoneNumber: string = '';
    public password: string = '';
    public confirmPassword: string = '';

    constructor() {
        super();
        this.authService = new AuthService();
    }

    async onSignUp() {
        try {
            if (!this.validateForm()) {
                return;
            }

            if (this.email) {
                await this.authService.signUpWithEmail(this.email, this.password);
            } else if (this.phoneNumber) {
                await this.authService.signInWithPhone(this.phoneNumber);
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    }

    private validateForm(): boolean {
        if (!this.email && !this.phoneNumber) {
            return false;
        }

        if (this.email && !validateEmail(this.email)) {
            return false;
        }

        if (this.phoneNumber && !validatePhone(this.phoneNumber)) {
            return false;
        }

        if (this.password !== this.confirmPassword) {
            return false;
        }

        return true;
    }

    onLoginTap() {
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate('views/auth/login-page');
    }
}