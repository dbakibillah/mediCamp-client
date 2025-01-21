import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ReactStars from "react-stars";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

const FeedbackPage = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: feedbacks = [], isError, isLoading, refetch } = useQuery({
        queryKey: "feedback",
        queryFn: async () => {
            try {
                if (user?.email) {
                    const response = await axiosSecure.get(`/feedback?email=${user.email}`);
                    return response.data;
                }
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            }
        },
    })

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This feedback will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/feedback/${id}`);
                    Swal.fire(
                        {
                            title: "Deleted!",
                            text: "Your feedback has been deleted.",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        }
                    );
                    refetch();
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: `Failed to delete feedback: ${error.message}`,
                        icon: "error",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            }
        });
    };

    if (isLoading) {
        return <div className="text-center">Loading...</div>;
    }
    if (isError) {
        return <div className="text-center">Error fetching feedbacks.</div>;
    }

    return (
        <section className="min-h-screen dark:bg-gray-900 py-12">
            <div className="container mx-auto lg:px-24 px-4">
                <h1 className="text-4xl font-bold text-center text-blue-700 dark:text-blue-300 mb-10">
                    Your Feedbacks
                </h1>
                {feedbacks.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {feedbacks.map((feedback) => (
                            <div
                                key={feedback._id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-transform transform overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                                            {feedback.campName}
                                        </h3>
                                        <button
                                            onClick={() => handleDelete(feedback._id)}
                                            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                        >
                                            <MdDelete className="text-2xl" />
                                        </button>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                                        {feedback.feedback}
                                    </p>
                                    <ReactStars
                                        count={5}
                                        value={feedback.rating}
                                        size={24}
                                        color2={"#ffd700"}
                                        edit={false}
                                    />
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
                                        {new Date(feedback.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-700 dark:text-gray-400 text-lg">
                        No feedback found.
                    </p>
                )}
            </div>
        </section>
    );
};

export default FeedbackPage;
