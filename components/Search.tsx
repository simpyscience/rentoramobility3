"use client";

interface SearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Search = ({ searchQuery, onSearchChange }: SearchProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <input
        type="text"
        placeholder="Search by name, brand, or model..."
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default Search;