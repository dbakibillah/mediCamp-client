import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { format } from "date-fns";
import ReactStarRatings from "react-star-ratings";

const AllFeedbacks = () => {
    const axiosPublic = useAxiosPublic();
    const { data: feedbacks = [], isError, isLoading, refetch } = useQuery({
        queryKey: ["feedbacks"],
        queryFn: async () => {
            const res = await axiosPublic.get("/feedback");
            return res.data;
        },
    });

    return (
        <section className="container mx-auto lg:px-24 p-2 min-h-screen py-12">
            {isLoading && (
                <div className="flex justify-center items-center h-full">
                    <p className="text-lg text-gray-600">Loading feedbacks...</p>
                </div>
            )}

            {isError && (
                <div className="flex justify-center items-center h-full">
                    <p className="text-lg text-red-500">
                        Error loading feedbacks. Please try again later.
                    </p>
                </div>
            )}

            {!isLoading && !isError && feedbacks.length === 0 && (
                <div className="flex justify-center items-center h-full">
                    <p className="text-lg text-gray-600">No feedbacks available.</p>
                </div>
            )}

            {!isLoading && !isError && feedbacks.length > 0 && (
                <div>
                    <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-100">All Feedbacks</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {feedbacks.map((feedback) => (
                            <div
                                key={feedback._id}
                                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4"
                            >
                                <img
                                    src={feedback.photoURL}
                                    alt={feedback.userName}
                                    className="w-16 h-16 rounded-full object-cover"
                                />

                                <div className="flex-1">
                                    <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100">
                                        {feedback.campName}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Submitted by: {feedback.userName}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Participant: {feedback.participantEmail}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Rating:{" "}
                                        <ReactStarRatings
                                            rating={feedback.rating}
                                            starRatedColor="yellow"
                                            numberOfStars={5}
                                            starDimension="14px"
                                            starSpacing="2px"
                                            name="rating"
                                        />
                                    </p>
                                    <p className="mt-2 text-gray-800 dark:text-gray-300">{feedback.feedback}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        {format(new Date(feedback.date), "MMM dd, yyyy")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </section>
    );
};

export default AllFeedbacks;
