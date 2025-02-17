import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./../../hooks/useAxiosPublic";
import CampCard from "../common/CampCard";

const PopularCamps = () => {
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const { data: camps = [], isLoading, isError, error } = useQuery({
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
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    Loading popular camps...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                    Error fetching popular camps: {error.message}
                </p>
            </div>
        );
    }

    return (
        <section className="py-12">
            <div className="container mx-auto lg:px-24 px-6">
                {/* Title */}
                <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-12">
                    Popular Medical Camps
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {camps.map((camp, index) => (
                        <CampCard key={index} camp={camp} />
                    ))}
                </div>

                <div className="text-center mt-10">
                    <button
                        className="inline-block border-2 border-blue-600 text-blue-600 font-medium text-lg px-6 py-3 rounded-xl shadow-lg hover:bg-gradient-to-r from-blue-500 to-indigo-600 hover:text-white hover:shadow-xl transform transition-all duration-500 ease-in-out"
                        onClick={() => navigate("/available-camps")}
                    >
                        See All Camps
                    </button>
                </div>

            </div>
        </section>
    );
};

export default PopularCamps;
