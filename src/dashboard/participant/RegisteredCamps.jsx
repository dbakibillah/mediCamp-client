import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProviders";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";

const RegisteredCamps = () => {
    const { user } = useContext(AuthContext);
    const [camps, setCamps] = useState([]);
    const [selectedCamp, setSelectedCamp] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchCamps = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/registered-camps/${user?.email}`
                );
                setCamps(response.data);
            } catch (error) {
                console.error("Error fetching registered camps:", error);
                Swal.fire("Error", "Failed to fetch registered camps.", "error");
            }
        };

        fetchCamps();
    }, [user]);

    const handleCancel = async (camp) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to undo this action.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/cancel-registration/${camp._id}`);
                    Swal.fire("Cancelled", "Your registration has been cancelled.", "success");
                    setCamps((prev) => prev.filter((c) => c._id !== camp._id));
                } catch (error) {
                    Swal.fire("Error", "Failed to cancel registration.", "error");
                }
            }
        });
    };

    const handleFeedback = (camp) => {
        setSelectedCamp(camp);
        const modal = document.getElementById("my_modal_1");
        if (modal) modal.showModal();
    };

    const submitFeedback = async () => {
        if (feedback) {
            try {
                await axios.post(`http://localhost:5000/submit-feedback`, {
                    email: user.email,
                    campId: selectedCamp._id,
                    feedback,
                    rating,
                });
                Swal.fire("Thank you!", "Your feedback has been submitted.", "success");
                setFeedback("");
                setRating(0);
                setSelectedCamp(null);
                const modal = document.getElementById("my_modal_1");
                if (modal) modal.close();
            } catch (error) {
                Swal.fire("Error", "Failed to submit feedback.", "error");
            }
        }
    };

    const handleRating = (rate) => setRating(rate);

    return (
        <div className="container mx-auto my-10 p-6 bg-gray-100 dark:bg-gray-900 shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
                Registered Camps
            </h2>
            {camps.length > 0 ? (
                <table className="w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                            <th className="border px-4 py-2">Camp Name</th>
                            <th className="border px-4 py-2">Fees</th>
                            <th className="border px-4 py-2">Participant Name</th>
                            <th className="border px-4 py-2">Payment Status</th>
                            <th className="border px-4 py-2">Confirmation Status</th>
                            <th className="border px-4 py-2">Cancel</th>
                            <th className="border px-4 py-2">Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {camps.map((camp) => (
                            <tr key={camp._id} className="text-gray-800 dark:text-gray-200">
                                <td className="border px-4 py-2">{camp.campName}</td>
                                <td className="border px-4 py-2">${camp.fees}</td>
                                <td className="border px-4 py-2">{camp.participantName}</td>
                                <td className="border px-4 py-2">
                                    {camp.paymentStatus === "Paid" ? (
                                        <span className="text-green-600">Paid</span>
                                    ) : (
                                        <Link to={`/dashboard/payment/${camp._id}`}>
                                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                                Pay Now
                                            </button>
                                        </Link>
                                    )}
                                </td>
                                <td className="border px-4 py-2">{camp.confirmationStatus || "Pending"}</td>
                                <td className="border px-4 py-2 space-x-2">
                                    <button
                                        className={`px-4 py-2 rounded ${camp.paymentStatus === "Paid"
                                            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                            : "bg-red-500 text-white hover:bg-red-600"
                                            }`}
                                        disabled={camp.paymentStatus === "Paid"}
                                        onClick={() => handleCancel(camp)}
                                    >
                                        Cancel
                                    </button>
                                </td>
                                <td className="border px-4 py-2 space-x-2">
                                    <button
                                        className={`px-4 py-2 rounded ${camp.paymentStatus === "Paid" &&
                                            camp.confirmationStatus === "Confirmed"
                                            ? "bg-green-600 text-white hover:bg-green-800"
                                            : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                            }`}
                                        disabled={camp.paymentStatus !== "Paid" || camp.confirmationStatus !== "Confirmed"}
                                        onClick={() => handleFeedback(camp)}
                                    >
                                        Feedback
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    No camps registered yet.
                </p>
            )}

            <dialog id="my_modal_1" className="modal">
                <div className="modal-box bg-gray-50 dark:bg-gray-800 space-y-4">
                    <h3 className="font-bold text-lg text-center">Provide Your Feedback</h3>
                    <textarea
                        name="feedback"
                        rows="4"
                        className="textarea textarea-bordered w-full dark:bg-gray-700"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    ></textarea>
                    <h2 className="mt-4 text-center text-lg font-bold">Your rating</h2>
                    <div className='flex justify-center'>
                        <ReactStars
                            count={5}
                            onChange={handleRating}
                            size={48}
                            activeColor="#ffd700"
                        />
                    </div>

                    <div className="modal-action w-full flex justify-center">
                        <button
                            className="btn bg-green-600 hover:bg-green-700 text-white border-none"
                            onClick={submitFeedback}
                        >
                            Submit
                        </button>
                        <button
                            className="btn bg-red-600 hover:bg-red-700 text-white border-none"
                            onClick={() => document.getElementById("my_modal_1").close()}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default RegisteredCamps;
