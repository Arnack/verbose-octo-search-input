import React from "react";

interface SuggestionItemProps {
  suggestion: string;
  query: string;
  isHighlighted: boolean;
  onSelectSuggestion: (suggestion: string) => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  suggestion,
  query,
  isHighlighted,
  onSelectSuggestion,
}) => {
  const highlightText = (text: string, highlight: string) => {
    const index = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <strong>{text.substring(index, index + highlight.length)}</strong>
        {text.substring(index + highlight.length)}
      </>
    );
  };

  return (
    <li
      className={`px-4 py-2 hover:bg-gray-600 cursor-pointer ${
        isHighlighted ? "bg-gray-600" : ""
      }`}
      onClick={() => onSelectSuggestion(suggestion)}
    >
      {highlightText(suggestion, query)}
    </li>
  );
};

export default SuggestionItem;
