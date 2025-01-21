import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import SearchBar from "../../components/searchBar/searchBar";

const ManageRegistrations = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const axiosSecure = useAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { data: camps = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ["camps"],
        queryFn: async () => {
            const response = await axiosSecure.get("/participants");
            return response.data;
        },
        onError: (err) => {
            console.error("Error fetching registered camps:", err);
            Swal.fire("Error", "Failed to load camp data.", "error");
        },
        refetchOnWindowFocus: true,
    });

    const filteredCamps = (camps || []).filter((camp) => {
        const campName = camp.campName || '';
        const date = camp.date || '';
        const participantName = camp.participantName || '';

        return (
            campName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            date.toLowerCase().includes(searchQuery.toLowerCase()) ||
            participantName.toLowerCase().includes(searchQuery.toLowerCase())
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

    const handleConfirmation = async (id, isPaid) => {
        if (isPaid === "Unpaid") {
            Swal.fire("Participant is not paid yet!", "Only paid registrations can be confirmed.", "error");
            return;
        }
        try {
            await axiosSecure.put(`/confirm-registration/${id}`);
            Swal.fire({
                title: "Registration confirmed",
                text: "The registration has been confirmed.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
            });
            refetch();
        } catch (error) {
            console.error("Error confirming registration:", error);
            Swal.fire({
                title: "Error confirming registration",
                text: "Failed to confirm registration. Please try again later.",
                icon: "error",
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    const handleCancellation = async (id, isPaid, isConfirmed) => {
        if (isPaid && isConfirmed) {
            Swal.fire("Error", "Cannot cancel a confirmed and paid registration.", "error");
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to cancel this registration?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it!",
            cancelButtonText: "No, keep it",
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/cancel-registration/${id}`);
                Swal.fire("Cancelled", "The registration has been canceled.", "success");
                refetch(); // Refetch to get updated list of camps
            } catch (error) {
                console.error("Error canceling registration:", error);
                Swal.fire("Error", "Failed to cancel registration. Please try again later.", "error");
            }
        }
    };

    if (isLoading) {
        return <p className="text-center text-lg font-medium text-gray-400">Loading registered camps...</p>;
    }

    if (isError) {
        return <p className="text-center text-lg font-medium text-red-500">{error.message}</p>;
    }

    return (
        <section className="container mx-auto px-4 py-10 dark:bg-gray-900">
            <h2 className="text-4xl font-bold text-center mb-6 text-blue-600">Manage Registrations</h2>
            <div className="flex justify-end mb-6">
                <SearchBar onSearch={handleSearch} />
            </div>
            <div className="overflow-x-auto">
                <table className="table w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                            <th className="border px-6 py-3">Camp Name</th>
                            <th className="border px-6 py-3">Camp Fees</th>
                            <th className="border px-6 py-3">Payment Status</th>
                            <th className="border px-6 py-3">Participant Name</th>
                            <th className="border px-6 py-3">Confirmation Status</th>
                            <th className="border px-6 py-3">Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCamps.map((camp) => (
                            <tr key={camp._id} className="hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all">
                                <td className="border px-6 py-3">{camp.campName}</td>
                                <td className="border px-6 py-4">{camp.fees}</td>
                                <td className="border px-6 py-4">{camp.participantName}</td>
                                <td
                                    className={camp.paymentStatus === "Paid" ? "text-green-500" : "text-red-500"}
                                >
                                    {camp.paymentStatus}
                                </td>
                                <td className="border px-6 py-4">
                                    {camp.confirmationStatus === "Confirmed" ? (
                                        <span className="text-green-500">Confirmed</span>
                                    ) : (
                                        <button
                                            onClick={() => handleConfirmation(camp._id, camp.paymentStatus)}
                                            className="btn btn-sm bg-yellow-500 text-white border-none"
                                        >
                                            Pending
                                        </button>
                                    )}
                                </td>
                                <td className="border px-6 py-4">
                                    <button
                                        onClick={() =>
                                            handleCancellation(
                                                camp._id,
                                                camp.paymentStatus === "Paid",
                                                camp.confirmationStatus === "Confirmed"
                                            )
                                        }
                                        className="btn btn-sm bg-red-500 text-white border-none"
                                        disabled={camp.paymentStatus === "Paid" && camp.confirmationStatus === "Confirmed"}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                            }`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default ManageRegistrations;
