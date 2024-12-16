import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';

export class LoginViewModel extends Observable {
    private authService: AuthService;
    public loginInput: string = '';
    public password: string = '';

    constructor() {
        super();
        this.authService = new AuthService();
    }

    async onLogin() {
        try {
            if (this.loginInput.includes('@')) {
                await this.authService.signInWithEmail(this.loginInput, this.password);
            } else {
                await this.authService.signInWithPhone(this.loginInput);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    onSignUpTap() {
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate('views/auth/signup-page');
    }
}