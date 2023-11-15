
export const fetchSuggestions = async (input: string, accessToken: string) => {
    const response = await fetch(`https://icebrg.mehanik.me/api/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ query: input })
    });
    return await response.json();
};
