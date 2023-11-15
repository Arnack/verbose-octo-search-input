export const getBearerToken  = (): string | null => {
    const token = window ? localStorage.getItem('token') : null;
    if (token) {
        return token;
    }
    return null;
}

export const isLoggedIn = (): boolean => {
    const token = getBearerToken();
    if (token) {
        return true;
    }
    return false;
}

export const login = (token: string): void => {
    if (window) {
        localStorage.setItem('token', token);
    }
}
