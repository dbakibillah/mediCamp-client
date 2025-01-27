import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

const Payment = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();

    const { data: camp = [], isLoading, isError, error } = useQuery({
        queryKey: ["payment", id],
        queryFn: async () => {
            const response = await axiosSecure.get(`/payment/${id}`);
            return response.data;
        },
        enabled: !!id,
        onError: (err) => {
            console.error("Error fetching camp details:", err);
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-gray-700 dark:text-gray-300 text-lg">Loading...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <p className="text-center text-red-500 text-lg">Error fetching camp details: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto my-10 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg lg:w-1/2">
            {camp ? (
                <>
                    <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">
                        Payment for {camp.campName}
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-lg font-semibold">
                        Total Fees: <span className="text-xl font-bold text-blue-600">${camp.fees}</span>
                    </p>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm totalPrice={camp.fees} campId={camp._id} campName={camp.campName} />
                    </Elements>
                </>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">Camp details are loading...</p>
            )}
        </div>
    );
};

export default Payment;
