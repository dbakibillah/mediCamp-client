import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);

const Payment = () => {
    const { id } = useParams();
    const [camp, setCamp] = useState(null);

    useEffect(() => {
        const fetchCamp = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/payment/${id}`);
                setCamp(response.data);
            } catch (error) {
                console.error("Error fetching camp details:", error);
            }
        };
        fetchCamp();
    }, [id]);

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
