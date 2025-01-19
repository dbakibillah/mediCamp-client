import { useState } from "react";
const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="mb-4 flex justify-end items-center">
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search camps..."
                className="input w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default SearchBar;
