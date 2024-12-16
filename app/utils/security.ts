import { firebase } from '@nativescript/firebase-core';
import * as CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'URS79-SECURE-KEY-2024'; // In production, use environment variables

export const encryptMessage = (message: string): string => {
    return CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();
};

export const decryptMessage = (encryptedMessage: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const hashPassword = (password: string): string => {
    return CryptoJS.SHA256(password).toString();
};

export const generateAuthToken = async (userId: string): Promise<string> => {
    const user = await firebase().auth().currentUser;
    return user?.getIdToken() || '';
};

export const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};