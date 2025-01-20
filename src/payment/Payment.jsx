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

    const { data: camp = [], isLoading, isError, error, refetch } = useQuery({
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
        return <p>Loading...</p>;
    }
    if (isError) {
        return <p className="text-center text-red-500 mb-6">Error fetching camp details: {error.message}</p>;
    }

    return (
        <div className="container mx-auto my-10 p-6 bg-gray-100 shadow-lg rounded-lg lg:w-1/2">
            {camp ? (
                <>
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Payment for {camp.campName}
                    </h2>
                    <p className="text-center text-gray-600 mb-4 text-lg font-semibold">Total Fees: ${camp.fees}</p>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm totalPrice={camp.fees} campId={camp._id} campName={camp.campName} />
                    </Elements>
                </>
            ) : (
                <p className="text-center">Loading...</p>
            )}
        </div>
    );
};

export default Payment;
