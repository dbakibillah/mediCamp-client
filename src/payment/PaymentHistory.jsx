import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../providers/AuthProviders";
import useAxiosSecure from "../hooks/useAxiosSecure";
import SearchBar from "../components/searchBar/SearchBar";

const PaymentHistory = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: paymentHistory = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ["paymentHistory", user?.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/payment-history/${user?.email}`);
            return response.data.data;
        },
        enabled: !!user?.email,
    });

    const filteredHistory = paymentHistory.filter((payment) => {
        const campName = payment.campName || "";
        const amount = payment.amount || "";

        return (
            campName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            amount.toString().includes(searchQuery.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
        refetch();
    };

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading payment history...</p>;
    }

    if (isError) {
        return <p className="text-center text-red-500">{error.message}</p>;
    }

    return (
        <div className="container mx-auto my-10 p-6 shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
                Payment History
            </h2>
            <div className="flex justify-end mb-6">
                <SearchBar onSearch={handleSearch} />
            </div>
            {paymentHistory.length > 0 ? (
                <>
                    <table className="w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                <th className="border px-4 py-2">Camp Name</th>
                                <th className="border px-4 py-2">Fees</th>
                                <th className="border px-4 py-2">Transaction ID</th>
                                <th className="border px-4 py-2">Payment Date</th>
                                <th className="border px-4 py-2">Payment Time</th>
                                <th className="border px-4 py-2">Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedHistory.map((payment) => (
                                <tr
                                    key={payment._id}
                                    className="text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <td className="border px-4 py-2">{payment.campName}</td>
                                    <td className="border px-4 py-2 font-semibold">
                                        ${payment.amount}
                                    </td>
                                    <td className="border px-4 py-2">{payment.transactionId}</td>
                                    <td className="border px-4 py-2">
                                        {new Date(payment.date).toLocaleString("en-US", {
                                            weekday: "short",
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {new Date(payment.date).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </td>
                                    <td className="border px-4 py-2 text-green-600 font-semibold">
                                        Paid
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-300 text-gray-800"
                                    }`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    No payment history available.
                </p>
            )}
        </div>
    );
};

export default PaymentHistory;
