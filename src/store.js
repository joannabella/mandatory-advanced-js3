import { BehaviorSubject } from 'rxjs';

export const token$ = new BehaviorSubject(window.localStorage.getItem('token') || null );

export function updateToken(newToken) {
    console.log(newToken);
    if (!newToken) {
        window.localStorage.removeItem('token');
    }
    else {
        window.localStorage.setItem('token', newToken);
    }
    token$.next(newToken);
}

export function removeToken() {
    window.localStorage.removeItem('token');
    token$.next(null);
}