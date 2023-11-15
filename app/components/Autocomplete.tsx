import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { getUniqueNames } from "../service/helpers";

type TSession = Session & {
  accessToken: string;
};

const Autocomplete = () => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { data: session } = useSession() as { data: TSession | null };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (input) {
        axios
          .post(
            `https://icebrg.mehanik.me/api/search`,
            { query: input },
            { headers: { Authorization: `Bearer ${session?.accessToken}` } }
          )
          .then((response) => {
            const suggestions = getUniqueNames(response.data);
            setSuggestions(suggestions);
          });
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [input, session?.accessToken]);

  const renderSuggestion = (suggestion: string) => {
    if (!input) return suggestion;
    const startIndex = suggestion.toLowerCase().indexOf(input.toLowerCase());
    if (startIndex === -1) return suggestion;

    const suggestionStart = suggestion.slice(0, startIndex);
    const suggestionUnhighlited = suggestion.slice(startIndex, startIndex + input.length);
    const suggestionEnd = suggestion.slice(startIndex + input.length);
    return (
      <>
        <strong>{suggestionStart}</strong>
        {suggestionUnhighlited}
        <strong>{suggestionEnd}</strong>
      </>
    );
  };

  return (
   <div className="min-h-screen flex flex-col items-center justify-start pt-10 bg-gray-900">
      <div className="w-full max-w-md relative">
        <input
          className="w-full px-4 py-2 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-blue-500 peer"
          type="text"
          value={input}
          placeholder="Search..."
          onChange={(e) => setInput(e.target.value)}
        />
        <ul className="hidden absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md bg-gray-700 hover:block peer-focus:block ">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
              onMouseUp={() => setInput(suggestion)}
            >
              {renderSuggestion(suggestion)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Autocomplete;
