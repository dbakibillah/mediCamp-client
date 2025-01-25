import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const UpcomingEvents = () => {
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const { data: events, isLoading, isError } = useQuery({
        queryKey: "upcomingEvents",
        queryFn: async () => {
            try {
                const response = await axiosPublic.get("/upcoming-events");
                return response.data;
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch events");
            }
        },
    }
    );

    if (isLoading) {
        return <p>Loading events...</p>;
    }

    if (isError) {
        return <p>Error fetching events. Please try again later.</p>;
    }

    return (
        <section className="container mx-auto lg:px-24 px-6 py-12">
            <h2 className="text-4xl font-bold mb-6 text-center">Upcoming Events</h2>
            {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div
                            key={event._id}
                            className="p-4 flex flex-col justify-between rounded-lg shadow-lg dark:bg-gray-800 dark:text-gray-100"
                        >
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">{event.campName}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">
                                    {event.description
                                        ? `${event.description.slice(0, 100)}...`
                                        : "No description available."}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Date: {new Date(event.dateTime).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate(`/camp-details/${event._id}`)}
                                className="btn bg-blue-600 text-white mt-4 w-full border-none"
                            >
                                Learn More
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-lg dark:text-gray-300">
                    No upcoming events at the moment. Stay tuned!
                </p>
            )}
        </section>
    );
};

export default UpcomingEvents;
