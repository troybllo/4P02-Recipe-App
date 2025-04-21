// src/components/SearchBar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/search/users?query=${query}`);
        const data = await res.json();
        setResults(data.users || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(delayDebounce); // debounce
  }, [query]);

  const handleSelect = (username) => {
    navigate(`/profile/${username}`);
    onClose?.(); // Close popup if passed
  };

  return (
    <div className="absolute top-16 right-4 bg-white border rounded shadow-lg p-4 w-80 z-50">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <ul>
        {results.map((user) => (
          <li
            key={user.userId}
            onClick={() => handleSelect(user.username)}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            <div className="font-semibold">{user.username}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </li>
        ))}
        {query.length >= 2 && results.length === 0 && (
          <li className="text-gray-400 text-sm p-2">No users found</li>
        )}
      </ul>
    </div>
  );
};

export default SearchBar;
