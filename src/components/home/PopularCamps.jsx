import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./../../hooks/useAxiosPublic";

const PopularCamps = () => {
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const { data: camps = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ["/popularCamps"],
        queryFn: async () => {
            try {
                const response = await axiosPublic.get("/popularcamps");
                return response.data;
            } catch (error) {
                console.error("Error fetching popular camps:", error);
                throw error;
            }
        },
    })

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching popular camps: {error.message}</p>;

    return (
        <section className="bg-gray-100 dark:bg-gray-900 container mx-auto lg:px-24 p-6 my-10">
            <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-12">
                Popular Medical Camps
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {camps.map((camp, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
                    >
                        <figure className="overflow-hidden p-3">
                            <img
                                src={camp.image}
                                alt={camp.name}
                                className="w-full h-52 object-cover rounded-lg"
                            />
                        </figure>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {camp.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                                {camp.description}
                            </p>
                            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-sm">
                                <li><strong>Fees:</strong> ${camp.fees}</li>
                                <li><strong>Date & Time:</strong> {camp.dateTime}</li>
                                <li><strong>Location:</strong> {camp.location}</li>
                                <li><strong>Healthcare Professional:</strong> {camp.healthcareProfessional}</li>
                                <li><strong>Participants:</strong> {camp.participantCount}</li>
                            </ul>
                            <button
                                className="btn bg-blue-600 text-white mt-4 w-full border-none"
                                onClick={() => navigate(`/camp-details/${camp._id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-10">
                <button
                    className="btn btn-outline border-blue-600 text-blue-600 px-6 py-3"
                    onClick={() => navigate("/availablecamps")}
                >
                    See All Camps
                </button>
            </div>
        </section>
    );
};

export default PopularCamps;
