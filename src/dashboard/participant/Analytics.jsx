import { useContext, useEffect, useState } from "react";
import axios from "axios";
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
import { AuthContext } from "../../providers/AuthProviders";

const Analytics = () => {
    const [campData, setCampData] = useState([]);
    const { user } = useContext(AuthContext);
    const [totals, setTotals] = useState({ participants: 0, fees: 0 });

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            if (!user?.email) return;

            try {
                const response = await axios.get(
                    `http://localhost:5000/analytics/${user.email}`
                );
                const data = response.data;

                // Calculate totals
                const totalParticipants = data.reduce(
                    (sum, camp) => sum + (camp.participantCount || 1),
                    0
                );
                const totalFees = data.reduce(
                    (sum, camp) => sum + (camp.fees || 0),
                    0
                );

                setCampData(data);
                setTotals({ participants: totalParticipants, fees: totalFees });
            } catch (error) {
                console.error("Error fetching analytics data:", error);
                Swal.fire("Error", "Failed to load analytics data.", "error");
            }
        };

        fetchAnalyticsData();
    }, [user]);

    // Define unique colors for bars
    const colors = ["#4CAF50", "#FF7043", "#42A5F5", "#AB47BC", "#FFCA28", "#26A69A"];

    return (
        <div className="container mx-auto my-20 p-6 bg-gray-100 dark:bg-gray-900 shadow-lg rounded-lg">
            <h2 className="text-center text-3xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">
                Analytics for {user?.displayName || "Participant"}
            </h2>
            {campData.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 gap-6 mb-10">
                        <div className="p-4 bg-indigo-200 dark:bg-indigo-800 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300">
                                Total Joined Camps
                            </h3>
                            <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
                                {totals.participants}
                            </p>
                        </div>
                        <div className="p-4 bg-green-200 dark:bg-green-800 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">
                                Total Fees
                            </h3>
                            <p className="text-3xl font-bold text-green-900 dark:text-green-100">
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
                                fill={colors[0]}
                            >
                                {campData.map((entry, index) => (
                                    <Bar
                                        key={`bar-${index}`}
                                        dataKey="fees"
                                        
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-10">
                        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
                            Camp Details:
                        </h3>
                        <ul className="space-y-6">
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
