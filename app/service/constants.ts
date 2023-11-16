const API_BASE_URL = "https://icebrg.mehanik.me/api";
export const LOGIN_ENDPOINT = `${API_BASE_URL}/login`;
export const SEARCH_ENDPOINT = `${API_BASE_URL}/search`;
export const REFRESH_TOKEN_ENDPOINT = `${LOGIN_ENDPOINT}/refresh`;

// there is no access token expiration in the API, so we set it manually
export const TOCKEN_EXPIRATION_TIMEOUT = 60 * 1 * 1000; 