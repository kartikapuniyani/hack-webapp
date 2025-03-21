import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useAtom } from "jotai";
import {
  mapViewportAtom,
  roadIssuesAtom,
  isLoadingAtom,
  searchQueryAtom,
} from "../../store/atoms";
import { fetchMockDataForCity } from "../../utils/mockData";

const SearchContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const SearchForm = styled.form`
  display: flex;
  width: 100%;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${(props) => props.theme.spacing.sm};
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const SearchButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 0 4px 4px 0;
  padding: ${(props) => props.theme.spacing.sm};
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
    border-color: ${(props) => props.theme.colors.secondary};
  }

  &:disabled {
    background-color: #ccc;
    border-color: #ccc;
    cursor: not-allowed;
  }
`;

const SearchResults = styled.div`
  margin-top: ${(props) => props.theme.spacing.sm};

  .suggestions {
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    li {
      padding: ${(props) => props.theme.spacing.sm};
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;

      &:hover {
        background-color: #f9f9f9;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
`;

// Create a list of common city suggestions
const popularCities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
];

const CitySearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [, setMapViewport] = useAtom(mapViewportAtom);
  const [, setRoadIssues] = useAtom(roadIssuesAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  // Filter suggestions based on input
  const filteredSuggestions = popularCities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle clicks outside of suggestions to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);

    // Fetch mock data for the searched city
    const { issues, viewport } = fetchMockDataForCity(searchQuery);

    // Update state
    setRoadIssues(issues);
    setMapViewport(viewport);
    setIsLoading(false);
  };

  const handleSuggestionClick = (city: string) => {
    setSearchQuery(city);
    setShowSuggestions(false);

    setIsLoading(true);

    // Fetch mock data for the selected city
    const { issues, viewport } = fetchMockDataForCity(city);

    // Update state
    setRoadIssues(issues);
    setMapViewport(viewport);
    setIsLoading(false);
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          placeholder="Search for a city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
        />
        <SearchButton type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Search"}
        </SearchButton>
      </SearchForm>

      {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
        <SearchResults>
          <ul ref={suggestionsRef} className="suggestions">
            {filteredSuggestions.map((city, index) => (
              <li key={index} onClick={() => handleSuggestionClick(city)}>
                {city}
              </li>
            ))}
          </ul>
        </SearchResults>
      )}
    </SearchContainer>
  );
};

export default CitySearch;
