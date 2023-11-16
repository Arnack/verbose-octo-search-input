import axios from "axios";
import { SEARCH_ENDPOINT } from "./constants";

export const fetchSuggestions = async (input: string, accessToken: string) => {
    const response = await axios.post(SEARCH_ENDPOINT, { query: input }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};
