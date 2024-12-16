import { NavigatedData, Page } from '@nativescript/core';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    
    setTimeout(() => {
        page.frame.navigate({
            moduleName: 'views/auth/login-page',
            clearHistory: true
        });
    }, 2000);
}