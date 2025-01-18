import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProviders";
import useAxiosSecure from "../hooks/useAxiosSecure";

const PaymentHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            const response = await axiosSecure.get(`/payment-history/${user?.email}`);
            if (response.data.success) {
                setPaymentHistory(response.data.data);
            } else {
                setError(response.data.message);
            }
        };

        fetchPaymentHistory();
    }, [axiosSecure, user?.email]);

    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-semibold text-center mb-6">Payment History</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-lg rounded-lg">
                    <thead>
                        <tr className="bg-blue-100 text-blue-800">
                            <th className="border px-4 py-2 text-left">Camp Name</th>
                            <th className="border px-4 py-2 text-left">Fees</th>
                            <th className="border px-4 py-2 text-left">Transaction ID</th>
                            <th className="border px-4 py-2 text-left">Payment Date</th>
                            <th className="border px-4 py-2 text-left">Payment Time</th>
                            <th className="border px-4 py-2 text-left">Payment Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory.map((payment) => (
                            <tr key={payment._id} className="hover:bg-blue-50">
                                <td className="border px-4 py-2">{payment.campName}</td>
                                <td className="border px-4 py-2 font-semibold text-gray-800">${payment.amount}</td>
                                <td className="border px-4 py-2">{payment.transactionId}</td>
                                <td className="border px-4 py-2">
                                    {new Date(payment.date).toLocaleString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </td>
                                <td className="border px-4 py-2">
                                    {new Date(payment.date).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
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
            </div>
        </div>
    );
};

export default PaymentHistory;
