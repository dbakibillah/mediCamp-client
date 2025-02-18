import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const OrganizerDashboard = () => {
    const axiosPublic = useAxiosPublic();

    const { data: camps = [], isLoading, isError, error } = useQuery({
        queryKey: ["camps"],
        queryFn: async () => {
            try {
                const response = await axiosPublic.get("/camps-stat");
                return response.data;
            } catch (error) {
                console.error(error);
                throw new Error("Failed to fetch camps");
            }
        },
    });

    const [stats, setStats] = useState({
        totalCamps: 0,
        totalParticipants: 0,
        livesImpacted: 0,
        totalFees: 0,
    });

    useEffect(() => {
        if (camps.length > 0) {
            const totalParticipants = camps.reduce((sum, camp) => sum + camp.participantCount, 0);
            const livesImpacted = totalParticipants * 2;
            const totalFees = camps.reduce(
                (sum, camp) => sum + (camp.participantCount * parseInt(camp.fees)),
                0
            );

            setStats({
                totalCamps: camps.length,
                totalParticipants,
                livesImpacted,
                totalFees,
            });
        }
    }, [camps]);

    const chartData = {
        labels: ["Total Camps", "Total Participants", "Lives Impacted"],
        datasets: [
            {
                label: "Statistics",
                data: [stats.totalCamps, stats.totalParticipants, stats.livesImpacted],
                backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
                borderColor: ["#3B82F6", "#10B981", "#F59E0B"],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return tooltipItem.raw.toLocaleString();
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString();
                    },
                },
            },
        },
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-red-500">Error fetching data: {error.message}</p>
            </div>
        );
    }

    return (
        <section className="container mx-auto p-6 lg:px-24">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-8 text-gray-800 dark:text-gray-100 text-center">
                Organizer Dashboard
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl text-gray-800 dark:text-gray-100 font-medium">Total Camps</h3>
                    <p className="text-4xl text-blue-600 dark:text-blue-400 font-bold mt-2">
                        {stats.totalCamps}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl text-gray-800 dark:text-gray-100 font-medium">Total Participants</h3>
                    <p className="text-4xl text-green-600 dark:text-green-400 font-bold mt-2">
                        {stats.totalParticipants}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl text-gray-800 dark:text-gray-100 font-medium">Lives Impacted</h3>
                    <p className="text-4xl text-yellow-600 dark:text-yellow-400 font-bold mt-2">
                        {stats.livesImpacted}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl text-gray-800 dark:text-gray-100 font-medium">Total Fees Collected</h3>
                    <p className="text-4xl text-red-600 dark:text-red-400 font-bold mt-2">
                        ${stats.totalFees.toLocaleString()}
                    </p>
                </div>
            </div>
            <div className="mt-10">
                <h3 className="text-2xl font-medium text-gray-800 dark:text-gray-100 text-center mb-6">
                    Camps Data Visualization
                </h3>
                <div className="flex justify-center">
                    <div className="w-full md:w-3/4 lg:w-2/3">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrganizerDashboard;
