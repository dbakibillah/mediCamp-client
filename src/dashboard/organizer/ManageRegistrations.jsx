import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ManageRegistrations = () => {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all registered camps
    useEffect(() => {
        const fetchCamps = async () => {
            try {
                const response = await axios.get("http://localhost:5000/participants");
                setCamps(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching registered camps:", error);
                Swal.fire("Error", "Failed to load camp data.", "error");
            }
        };

        fetchCamps();
    }, []);

    // Handle confirmation status update
    const handleConfirmation = async (id, isPaid) => {
        if (isPaid === "Unpaid") {
            Swal.fire("Participant is not paid yet!", "Only paid registrations can be confirmed.", "error");
            return;
        }
        Swal.fire({
            title: "Processing...",
            text: "Please wait while we confirm the registration.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            await axios.put(`http://localhost:5000/confirm-registration/${id}`);
            setCamps((prevCamps) =>
                prevCamps.map((camp) =>
                    camp._id === id ? { ...camp, confirmationStatus: "Confirmed" } : camp
                )
            );
            Swal.fire("Success", "Registration confirmed successfully!", "success");
        } catch (error) {
            console.error("Error confirming registration:", error);
            Swal.fire("Error", "Failed to confirm registration.", "error");
        }
    };


    // Handle cancellation
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
                await axios.delete(`http://localhost:5000/cancel-registration/${id}`);
                setCamps((prevCamps) => prevCamps.filter((camp) => camp._id !== id));
                Swal.fire("Cancelled", "The registration has been canceled.", "success");
            } catch (error) {
                console.error("Error canceling registration:", error);
                Swal.fire("Error", "Failed to cancel registration. Please try again later.", "error");
            }
        }
    };


    if (loading) {
        return <p className="text-center text-lg font-medium">Loading registered camps...</p>;
    }

    return (
        <section className="container mx-auto px-4 py-10">
            <h2 className="text-4xl font-bold text-center mb-6 text-blue-600">Manage Registrations</h2>
            <div className="overflow-x-auto">
                <table className="table w-full text-center">
                    <thead>
                        <tr className="bg-gray-200">
                            <th>Camp Name</th>
                            <th>Camp Fees</th>
                            <th>Participant Name</th>
                            <th>Payment Status</th>
                            <th>Confirmation Status</th>
                            <th>Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {camps.map((camp) => (
                            <tr key={camp._id} className="hover">
                                <td>{camp.campName}</td>
                                <td>{camp.fees}</td>
                                <td>{camp.participantName}</td>
                                <td className={camp.paymentStatus === "Paid" ? "text-green-500" : "text-red-500"}>
                                    {camp.paymentStatus}
                                </td>
                                <td>
                                    {camp.confirmationStatus === "Confirmed" ? (
                                        <span className="text-green-500">Confirmed</span>
                                    ) : (
                                        <button
                                            onClick={() => handleConfirmation(camp._id, camp.paymentStatus)}
                                            className="btn btn-sm btn-warning"
                                        >
                                            Pending
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <button
                                        onClick={() =>
                                            handleCancellation(
                                                camp._id,
                                                camp.paymentStatus === "Paid",
                                                camp.confirmationStatus === "Confirmed"
                                            )
                                        }
                                        className="btn btn-sm btn-error"
                                        disabled={
                                            camp.paymentStatus === "Paid" && camp.confirmationStatus === "Confirmed"
                                        }
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ManageRegistrations;
