import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageFeedback = () => {
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const { data: feedbacks = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ["feedbacks"],
        queryFn: async () => {
            try {
                const response = await axiosPublic.get("/feedback");
                return response.data;
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch feedbacks");
            }
        },
    });

    const handleDeleteFeedback = async (id) => {
        try {
            await axiosSecure.delete(`/feedback/${id}`);
            Swal.fire({
                icon: "success",
                title: "Feedback deleted successfully",
                showConfirmButton: false,
                timer: 2000,
            });
            refetch();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed to delete feedback",
                text: error.message,
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    if (isLoading) {
        return <p>Loading feedbacks...</p>;
    }

    if (isError) {
        return <p>Error fetching data: {error.message}</p>;
    }

    return (
        <div className="container mx-auto lg:px-24 p-6 text-gray-800 dark:text-white">
            <h2 className="text-4xl font-bold text-center text-gradient mb-8">
                Manage Feedback
            </h2>

            {/* Feedback Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                            <th className="p-4 text-sm font-medium">User</th>
                            <th className="p-4 text-sm font-medium">Camp</th>
                            <th className="p-4 text-sm font-medium">Rating</th>
                            <th className="p-4 text-sm font-medium">Feedback</th>
                            <th className="p-4 text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback) => (
                            <tr key={feedback._id} className="border-t dark:border-gray-600">
                                <td className="p-4 flex items-center space-x-2">
                                    <img
                                        src={feedback.photoURL}
                                        alt={feedback.userName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <span>{feedback.userName}</span>
                                </td>
                                <td className="p-4">{feedback.campName}</td>
                                <td className="p-4">{feedback.rating}</td>
                                <td className="p-4">{feedback.feedback}</td>
                                <td className="p-4 space-x-2">
                                    <button
                                        className="text-red-600 dark:text-red-400"
                                        onClick={() => handleDeleteFeedback(feedback._id)}
                                    >
                                        <FaTrash className="inline-block" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageFeedback;
