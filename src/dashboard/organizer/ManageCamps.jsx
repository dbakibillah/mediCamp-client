import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import SearchBar from "../../components/searchBar/SearchBar";

const ManageCamps = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const axiosSecure = useAxiosSecure();
    const itemsPerPage = 10;

    const { data: camps = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ["camps"],
        queryFn: async () => {
            const response = await axiosSecure.get("/camps");
            return response.data;
        },
        onError: (err) => {
            console.error("Error fetching registered camps:", err);
            Swal.fire("Error", "Failed to load camp data.", "error");
        },
    });

    const filteredCamps = (camps || []).filter((camp) => {
        const campName = camp.name || '';
        const date = camp.dateTime || '';
        const location = camp.location || '';
        const healthcareProfessional = camp.healthcareProfessional || '';

        return (
            campName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            date.toLowerCase().includes(searchQuery.toLowerCase()) ||
            location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            healthcareProfessional.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredCamps.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCamps = filteredCamps.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleDelete = async (campId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                const response = await axiosSecure.delete(`/delete-camp/${campId}`);
                if (response.data.deleted) {
                    Swal.fire("Deleted!", "The camp has been deleted.", "success");
                    refetch();
                } else {
                    Swal.fire("Error!", "Failed to delete the camp.", "error");
                }
            } catch (error) {
                console.error("Error deleting camp:", error);
                Swal.fire("Error!", "Something went wrong. Please try again.", "error");
            }
        }
    };

    return (
        <section className="container mx-auto px-6 py-12 lg:my-20">
            <div className="overflow-x-auto">
                <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">Manage Camps</h2>
                {isLoading && <p className="text-center text-gray-500">Loading camps...</p>}
                {isError && (
                    <p className="text-center text-red-500">Error: {error.message}</p>
                )}
                <div className="flex justify-end mb-6">
                    <SearchBar onSearch={handleSearch} />
                </div>
                {camps.length > 0 && (
                    <>
                        <table className="table w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                    <th className="border px-6 py-3">#</th>
                                    <th className="border px-6 py-3">Camp Name</th>
                                    <th className="border px-6 py-3">Date & Time</th>
                                    <th className="border px-6 py-3">Location</th>
                                    <th className="border px-6 py-3">Healthcare Professional</th>
                                    <th className="border px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCamps.map((camp, index) => (
                                    <tr key={camp._id} className="hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all">
                                        <th className="border px-6 py-4">{startIndex + index + 1}</th>
                                        <td className="border px-6 py-4">{camp.name}</td>
                                        <td className="border px-6 py-4">{new Date(camp.dateTime).toLocaleString()}</td>
                                        <td className="border px-6 py-4">{camp.location}</td>
                                        <td className="border px-6 py-4">{camp.healthcareProfessional}</td>
                                        <td className="border px-6 py-4">
                                            <div className="flex gap-3 justify-center">
                                                <Link to={`/dashboard/update-camp/${camp._id}`}>
                                                    <button className="btn bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-all border-none">Update</button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(camp._id)}
                                                    className="btn bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-all border-none"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {camps.length === 0 && (
                            <p className="text-center text-gray-500 mt-6">No camps available to manage.</p>
                        )}
                        <div className="flex justify-center mt-6">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    className={`mx-2 px-4 py-2 rounded-lg ${currentPage === index + 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-300 dark:bg-gray-600 dark:text-gray-300 text-gray-800"
                                        } transition-all hover:bg-blue-700`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default ManageCamps;
