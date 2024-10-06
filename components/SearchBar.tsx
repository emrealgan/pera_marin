"use client";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);  // Trigger the search callback
  };

  return (
    <div className="w-full mb-6 px-8">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search by name, brand, or code..."
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
      />
    </div>
  );
}
