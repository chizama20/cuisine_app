import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, regions = [], countries = [], className = '' }) => {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch({ q: query || undefined, region: region || undefined, country: country || undefined });
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, region, country]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`search-bar ${className}`.trim()}>
      <div className="search-input-wrapper">
        <span className="search-icon">&#x2315;</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="search-filters">
        {regions.length > 0 && (
          <select
            className="search-select"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        )}
        {countries.length > 0 && (
          <select
            className="search-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
