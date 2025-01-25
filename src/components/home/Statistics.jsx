import { FaUsers, FaCampground, FaHeartbeat, FaDollarSign } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Statistics = () => {
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

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>Error fetching data: {error.message}</p>;
    }

    return (
        <div className="container mx-auto lg:px-24 p-6 my-20 dark:bg-gray-900 text-gray-800 dark:text-white">
            <h2 className="text-4xl font-bold text-center text-gradient mb-8">
                Our Impact in Numbers
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* Camps Conducted */}
                <div className="stats-card bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-lg shadow-lg text-white text-center">
                    <div className="flex justify-center items-center mb-4">
                        <FaCampground className="text-4xl" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Camps Conducted</h3>
                    <p className="text-3xl font-bold">{stats.totalCamps}</p>
                </div>

                {/* Participants Served */}
                <div className="stats-card bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-lg shadow-lg text-white text-center">
                    <div className="flex justify-center items-center mb-4">
                        <FaUsers className="text-4xl" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Participants Served</h3>
                    <p className="text-3xl font-bold">{stats.totalParticipants}</p>
                </div>

                {/* Lives Impacted */}
                <div className="stats-card bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-lg shadow-lg text-white text-center">
                    <div className="flex justify-center items-center mb-4">
                        <FaHeartbeat className="text-4xl" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Lives Impacted</h3>
                    <p className="text-3xl font-bold">{stats.livesImpacted}</p>
                </div>

                {/* Total Fees Collected */}
                <div className="stats-card bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg shadow-lg text-white text-center">
                    <div className="flex justify-center items-center mb-4">
                        <FaDollarSign className="text-4xl" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Total Fees Collected</h3>
                    <p className="text-3xl font-bold">{stats.totalFees} BDT</p>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
