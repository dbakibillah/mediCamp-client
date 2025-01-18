import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Loading from "../../pages/common/Loading";
import ReactStars from "react-stars";
import Marquee from "react-fast-marquee"; // Importing Marquee

const FeedbackRating = () => {
    const axiosPublic = useAxiosPublic();

    const { data: feedbacks = [], isLoading, isError, error } = useQuery({
        queryKey: ["feedbacks"],
        queryFn: async () => {
            const response = await axiosPublic.get("/feedback");
            return response.data;
        },
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <p className="text-center text-red-500">Error: {error.message}</p>;
    }

    if (feedbacks.length === 0) {
        return <p className="text-center text-gray-500">No feedback available yet.</p>;
    }

    return (
        <div className="container mx-auto lg:px-24 p-4">
            <h2 className="text-3xl font-semibold text-center mb-6">What Participants Say</h2>

            <Marquee className="overflow-hidden" pauseOnHover={true}>
                <div className="flex">
                    {feedbacks.map((feedback) => (
                        <div
                            key={feedback._id}
                            className="w-80 border p-2 shadow-md rounded-lg flex flex-col items-center hover:shadow-xl transition duration-300 mx-2"
                        >
                            <figure className="my-4">
                                <img src={feedback.photoURL} alt="" className="w-20 h-20 rounded-full" />
                            </figure>
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">
                                {feedback.userName}
                            </h3>
                            <p className="text-gray-800">{feedback.feedback}</p>

                            <div className="mt-2">
                                <ReactStars
                                    count={5}
                                    value={feedback.rating}
                                    size={24}
                                    color2={"#ffd700"}
                                    edit={false}
                                />
                            </div>

                            <p className="text-gray-500 text-xs mt-2">
                                {new Date(feedback.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    ))}
                </div>
            </Marquee>
        </div>
    );
};

export default FeedbackRating;
