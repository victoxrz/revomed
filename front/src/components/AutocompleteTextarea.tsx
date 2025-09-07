"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { visit } from "@/lib/actions";

interface AutocompleteTextareaProps {
  name: string;
  templateId: number;
  fieldKey: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  minChars?: number;
  maxSuggestions?: number;
}

export default function AutocompleteTextarea({
  name,
  templateId,
  fieldKey,
  defaultValue = "",
  className = "textarea textarea-bordered w-full",
  minChars = 2,
}: AutocompleteTextareaProps) {
  const [currentWord, setCurrentWord] = useState("");
  const [debouncedWord, setDebouncedWord] = useState("");
  const [wordPosition, setWordPosition] = useState({ start: 0, end: 0 });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Debounce the current word
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedWord(currentWord);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentWord]);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["suggestions", debouncedWord, templateId, fieldKey],
    queryFn: async () =>
      (await visit.getSuggestion(debouncedWord, templateId, fieldKey)) ?? [],
    enabled: debouncedWord.length >= minChars,
  });

  // Show suggestions when we have data
  useEffect(() => {
    setShowSuggestions(
      debouncedWord.length >= minChars && suggestions.length > 0
    );
    setHighlightedIndex(0);
  }, [suggestions, debouncedWord, minChars]);

  function getCurrentWord(text: string, cursorPosition: number) {
    const pos = Math.max(0, Math.min(cursorPosition, text.length));

    let start = pos;
    while (start > 0 && !/\s/.test(text[start - 1])) {
      start--;
    }

    let end = pos;
    while (end < text.length && !/\s/.test(text[end])) {
      end++;
    }

    return { word: text.slice(start, end), start, end };
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const cursorPosition = e.target.selectionStart || 0;
    const { word, start, end } = getCurrentWord(e.target.value, cursorPosition);

    setCurrentWord(word);
    setWordPosition({ start, end });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        if (e.shiftKey) return;
        e.preventDefault();
        selectSuggestion(suggestions[highlightedIndex]);
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  }

  function selectSuggestion(suggestion: string) {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const value = textarea.value;
    const newValue =
      value.slice(0, wordPosition.start) +
      suggestion +
      value.slice(wordPosition.end);

    textarea.value = newValue;
    setShowSuggestions(false);
    setCurrentWord("");

    const newCursorPosition = wordPosition.start + suggestion.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  }

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        name={name}
        defaultValue={defaultValue}
        onChange={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";

          handleInputChange(e);
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`${className} resize-none overflow-hidden`}
        autoComplete="off"
      />

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 shadow-lg max-h-40 bg-base-100 border border-base-300 rounded-field overflow-y-auto z-10">
          {isLoading && (
            <div className="p-2 text-center">
              <span className="loading loading-spinner loading-sm"></span>
            </div>
          )}
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`p-2 cursor-pointer ${
                index === highlightedIndex
                  ? "bg-primary text-primary-content"
                  : ""
              }`}
              onClick={() => selectSuggestion(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
