export enum AuthStatus {
    Checking,
    Authenticated,
    NotAuthenticated
}

export interface AuthRespose {
    token: string;
}