import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProviders";
import useAxiosSecure from "../hooks/useAxiosSecure";

const CheckoutForm = ({ totalPrice, campId, campName }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const axiosSecure = useAxiosSecure();

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
            console.log('payment error', error);
            setError(error.message);
        }
        else {
            console.log('payment method', paymentMethod)
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

            Swal.fire("Success", "Payment successful!", "success");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: "16px",
                            color: "#333",
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
            {
                clientSecret && (
                    <button
                        type="submit"
                        className={`btn w-full ${transactionId ? "btn-success" : "btn-primary"}`}
                        disabled={!stripe || !elements || loading || transactionId}
                    >
                        {transactionId ? "Paid" : loading ? "Processing..." : `Pay $${totalPrice}`}
                    </button>
                )
            }
            {error && <p className="text-red-600">{error}</p>}
            {transactionId && <p className="text-green-600">Transaction ID: {transactionId}</p>}
        </form>
    );
};

export default CheckoutForm;
