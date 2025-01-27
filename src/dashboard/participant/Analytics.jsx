import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import Swal from "sweetalert2";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthProviders";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Analytics = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);

    const { data: campData = [], isLoading, isError, error } = useQuery({
        queryKey: ["analytics", user?.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/analytics/${user?.email}`);
            return response.data;
        },
        enabled: !!user?.email, onError: (error) => {
            Swal.fire("Error", "Failed to load analytics data.", "error");
            console.error("Error fetching analytics data:", error);
        },
    });
    const totals = campData.reduce(
        (acc, camp) => {
            acc.participants += parseInt(camp.participantCount) || 1;
            acc.fees += parseFloat(camp.fees) || 0;
            return acc;
        },
        { participants: 0, fees: 0 }
    );

    const colors = ["#4CAF50", "#FF7043", "#42A5F5", "#AB47BC", "#FFCA28", "#26A69A"];

    if (isLoading) {
        return (
            <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
                Loading analytics data...
            </p>
        );
    }

    if (isError) {
        return (
            <p className="text-center text-red-500 text-lg">
                Error loading data: {error.message}
            </p>
        );
    }

    return (
        <div className="container mx-auto my-20 p-6 shadow-lg rounded-lg">
            <h2 className="text-center text-3xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">
                Analytics for {user?.displayName || "Participant"}
            </h2>
            {campData.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 gap-6 mb-10">
                        <div className="p-4 bg-gradient-to-tr from-indigo-600 to-indigo-800 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-white">
                                Total Joined Camps
                            </h3>
                            <p className="text-3xl font-bold text-white">
                                {totals.participants}
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-tr from-green-600 to-green-800 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-white">
                                Total Fees
                            </h3>
                            <p className="text-3xl font-bold text-white">
                                ${totals.fees}
                            </p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={campData.map((camp, index) => ({
                                id: index,
                                name: camp.campName || "Unnamed Camp",
                                fees: camp.fees || 0,
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={document.body.classList.contains("dark") ? "#555" : "#ccc"}
                            />
                            <XAxis
                                dataKey="name"
                                stroke={document.body.classList.contains("dark") ? "#ddd" : "#333"}
                            />
                            <YAxis
                                stroke={document.body.classList.contains("dark") ? "#ddd" : "#333"}
                            />
                            <Tooltip />
                            <Bar
                                dataKey="fees"
                                barSize={100}
                                name="Fees (in USD)"
                                fill={colors[Math.floor(Math.random() * colors.length)]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-10">
                        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
                            Camp Details:
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {campData.map((camp, index) => (
                                <li
                                    key={index}
                                    className="p-6 bg-white shadow dark:bg-gray-800 rounded-lg border border-gray-200"
                                >
                                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                        {camp.campName || "Unnamed Camp"}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Location: {camp.location || "Unknown"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Participant Name: {camp.participantName || "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Fees: ${camp.fees || 0}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Payment Status: {camp.paymentStatus}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
                    No data available for registered camps.
                </p>
            )}
        </div>
    );
};

export default Analytics;
