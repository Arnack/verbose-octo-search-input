export const API_BASE_URL = "https://icebrg.mehanik.me/api";
export const LOGIN_ENDPOINT = `${API_BASE_URL}/login`;
export const SEARCH_ENDPOINT = `${API_BASE_URL}/search`;
export const REFRESH_TOKEN_ENDPOINT = `${LOGIN_ENDPOINT}/refresh`;

export const DEFAULT_EMAIL = process.env.NEXT_PUBLIC_DEFAULT_EMAIL;
export const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD;