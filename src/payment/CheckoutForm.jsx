import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProviders";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ totalPrice, campId, campName }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    useEffect(() => {
        if (totalPrice > 0) {
            axiosSecure.post("/create-payment-intent", { amount: totalPrice }).then((res) => {
                setClientSecret(res.data.clientSecret);
            });
        }
    }, [axiosSecure, totalPrice]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        if (!stripe || !elements) {
            setError("Stripe or Elements not loaded.");
            setLoading(false);
            return;
        }

        const card = elements.getElement(CardElement);
        if (!card) {
            setError("Card details not found.");
            setLoading(false);
            return;
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })
        if (error) {
            setError(error.message);
        } else {
            setError('');
        }

        setLoading(true);
        setError("");

        try {
            const { data } = await axiosSecure.post("/create-payment-intent", {
                amount: totalPrice,
            });
            const clientSecret = data.clientSecret;
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: user?.displayName || "Anonymous",
                        email: user?.email || "anonymous@example.com",
                    },
                },
            });

            if (confirmError) {
                setError(confirmError.message);
                setLoading(false);
                return;
            }
            setTransactionId(paymentIntent.id);

            await axiosSecure.post("/make-payment", {
                email: user.email,
                campId,
                campName,
                amount: totalPrice,
                transactionId: paymentIntent.id,
            });
            await axiosSecure.put(`/update-payment-status/${campId}`, {
                email: user.email,
                paymentStatus: "Paid",
                campId,
                amount: totalPrice,
                transactionId: paymentIntent.id,
            });

            Swal.fire({
                position: "top-middle",
                icon: "success",
                title: "Payment Successful",
                text: `Thank you for your payment!\nYour Transaction ID: ${paymentIntent.id}`,
                showConfirmButton: false,
                timer: 2000,
            });

            navigate("/dashboard/payment-history");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">
                Complete Payment for {campName}
            </h2>

            <div className="w-full">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Card Details</label>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#26A69A",
                                borderRadius: "8px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                "::placeholder": {
                                    color: "#aaa",
                                },
                            },
                            invalid: {
                                color: "#e63946",
                            },
                        },
                    }}
                />
            </div>

            {clientSecret && (
                <button
                    type="submit"
                    className={`w-full py-3 text-lg font-medium rounded-lg ${transactionId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                        } text-white focus:outline-none`}
                    disabled={!stripe || !elements || loading || transactionId}
                >
                    {transactionId ? "Paid" : loading ? "Processing..." : `Pay $${totalPrice}`}
                </button>
            )}

            {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
            {transactionId && <p className="text-green-600 text-center">Transaction ID: {transactionId}</p>}
        </form>
    );
};

export default CheckoutForm;
