import { Animation } from '@nativescript/core';

export const createSwipeAnimation = (view: any, direction: 'left' | 'right') => {
    return new Animation([{
        target: view,
        translate: { x: direction === 'left' ? -200 : 200, y: 0 },
        duration: 250,
        opacity: 0
    }]);
};

export const createMatchAnimation = (view: any) => {
    return new Animation([{
        target: view,
        scale: { x: 1.2, y: 1.2 },
        duration: 200
    }, {
        target: view,
        scale: { x: 1, y: 1 },
        duration: 200
    }]);
};

export const createHeartbeatAnimation = (view: any) => {
    return new Animation([{
        target: view,
        scale: { x: 1.2, y: 1.2 },
        duration: 150
    }, {
        target: view,
        scale: { x: 1, y: 1 },
        duration: 150
    }]);
};