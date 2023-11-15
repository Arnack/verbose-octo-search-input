import { SEARCH_ENDPOINT } from "./constants";

export const fetchSuggestions = async (input: string, accessToken: string) => {
    const response = await fetch(SEARCH_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ query: input })
    });
    return await response.json();
};
