import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProviders";
import useAxiosSecure from "../hooks/useAxiosSecure";

const PaymentHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const response = await axiosSecure.get(`/payment-history/${user?.email}`);
                if (response.data.success) {
                    setPaymentHistory(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                console.error("Error fetching payment history:", err);
                setError("Failed to fetch payment history.");
            }
        };

        fetchPaymentHistory();
    }, [axiosSecure, user?.email]);

    const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedHistory = paymentHistory.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="container mx-auto my-10 p-6 bg-gray-100 dark:bg-gray-900 shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
                Payment History
            </h2>
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
                                    <td className="border px-4 py-2 font-semibold text-gray-800">
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
