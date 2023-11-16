import React, { useState, useEffect, KeyboardEvent, FC } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { getUniqueNames } from "../service/helpers";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { fetchSuggestions } from "../service/api";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useDebounce } from "../hooks/useDebounce";
import SuggestionItem from "./SuggestionItem";

interface AutocompleteProps {
  accessToken: string;
}

const Autocomplete: FC<AutocompleteProps> = ({ accessToken }) => {
  const [input, setInput] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const debouncedInput = useDebounce(input, 500);

  const { isLoading, isError, data, error } = useQuery(
    ["suggestions", debouncedInput],
    () => fetchSuggestions(debouncedInput, accessToken),
    { enabled: !!debouncedInput }
  );

  const handleSelectSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  useEffect(() => {
    if (isError && error instanceof Error) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const suggestions = getUniqueNames(data || []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      setInput(suggestions[highlightedIndex]);
    }
  };

  const shouldRenderSuggestions = input.trim() !== "" && suggestions.length > 1 && suggestions[0] !== input;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-10 bg-gray-900">
      <div className="w-full max-w-md relative">
        <input
          className="w-full px-4 py-2 text-gray-200 bg-gray-700 rounded-md focus:outline-none peer"
          type="text"
          value={input}
          placeholder="Search..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
          </div>
        )}
        {shouldRenderSuggestions && (
          <ul className="hidden absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md bg-gray-700 hover:block peer-focus:block ">
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={suggestion}
                suggestion={suggestion}
                query={input}
                isHighlighted={index === highlightedIndex}
                onSelectSuggestion={handleSelectSuggestion}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Autocomplete;
