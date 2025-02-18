import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CampCard from "../../components/common/CampCard";
import SearchBar from "../../components/searchBar/SearchBar";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const AvailableCamps = () => {
    const axiosPublic = useAxiosPublic();
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [layout, setLayout] = useState("three");

    const { data: camps = [], isLoading, isError } = useQuery({
        queryKey: ["/camps"],
        queryFn: async () => {
            const response = await axiosPublic.get("/available-camps");
            return response.data;
        },
    });

    const filteredCamps = camps.filter((camp) =>
        camp.campName.toLowerCase().includes(search.toLowerCase()) ||
        camp.location.toLowerCase().includes(search.toLowerCase())
    );

    const sortedCamps = [...filteredCamps].sort((a, b) => {
        if (sortBy === "most-registered") {
            return b.participantCount - a.participantCount;
        }
        if (sortBy === "camp-fees") {
            return parseFloat(a.fees) - parseFloat(b.fees);
        }
        if (sortBy === "alphabetical") {
            return a.campName.localeCompare(b.campName);
        }
        return 0;
    });

    const toggleLayout = () => setLayout(layout === "three" ? "two" : "three");

    if (isLoading) return <p className="text-center min-h-screen dark:text-white">Loading camps...</p>;
    if (isError) return <p className="text-center min-h-screen dark:text-white">Error fetching camps. Please try again later.</p>;

    return (
        <div className="container mx-auto lg:px-24 p-4 min-h-screen text-gray-800 dark:text-white">
            <div className="flex justify-end items-center mb-6 gap-4">
                <SearchBar onSearch={setSearch} />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border p-3 rounded-md w-full sm:w-auto shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="">Sort By</option>
                    <option value="most-registered">Most Registered</option>
                    <option value="camp-fees">Camp Fees</option>
                    <option value="alphabetical">Alphabetical Order</option>
                </select>
                <button
                    onClick={toggleLayout}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-md shadow-md hover:from-indigo-600 hover:to-blue-500 transition-all w-full sm:w-auto"
                >
                    Toggle Layout
                </button>
            </div>

            {/* Camps Display Section */}
            <div
                className={`grid gap-4 ${layout === "three" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"}`}
            >
                {sortedCamps.map((camp) => (
                    <CampCard key={camp._id} camp={camp} />
                ))}
            </div>
        </div>
    );
};

export default AvailableCamps;
