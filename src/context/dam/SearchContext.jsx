import React, { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleQueryChange = (q) => {
    setQuery(q);
  };

  return (
    <SearchContext.Provider
      value={{ searchResults, handleSearchResults, query, handleQueryChange }}
    >
      {children}
    </SearchContext.Provider>
  );
};

