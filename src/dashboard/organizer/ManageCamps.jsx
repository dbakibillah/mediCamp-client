import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ManageCamps = () => {
    const [camps, setCamps] = useState([]);

    // Fetch camps created by the organizer
    useEffect(() => {
        const fetchCamps = async () => {
            try {
                const response = await axios.get("http://localhost:5000/camps");
                setCamps(response.data);
            } catch (error) {
                console.error("Error fetching camps:", error);
            }
        };
        fetchCamps();
    }, []);

    // Delete a camp
    const handleDelete = async (campId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                const response = await axios.delete(`http://localhost:5000/delete-camp/${campId}`);
                if (response.data.deleted) {
                    setCamps(camps.filter((camp) => camp._id !== campId));
                    Swal.fire("Deleted!", "The camp has been deleted.", "success");
                } else {
                    Swal.fire("Error!", "Failed to delete the camp.", "error");
                }
            } catch (error) {
                console.error("Error deleting camp:", error);
                Swal.fire("Error!", "Something went wrong. Please try again.", "error");
            }
        }
    };


    return (
        <section className="container mx-auto px-4 py-10 lg:my-20">
            <div className="overflow-x-auto">
                <h2 className="text-4xl font-bold text-center mb-6">Manage Camps</h2>
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Camp Name</th>
                            <th>Date & Time</th>
                            <th>Location</th>
                            <th>Healthcare Professional</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {camps.map((camp, index) => (
                            <tr key={camp._id} className="hover:bg-gray-200">
                                <th>{index + 1}</th>
                                <td>{camp.campName}</td>
                                <td>{new Date(camp.dateTime).toLocaleString()}</td>
                                <td>{camp.location}</td>
                                <td>{camp.professionalName}</td>
                                <td>
                                    <div className="flex gap-2">
                                        {/* Update Button */}
                                        <Link to={`/dashboard/update-camp/${camp._id}`}>
                                            <button className="btn bg-blue-600 text-white">
                                                Update
                                            </button>
                                        </Link>
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(camp._id)}
                                            className="btn bg-red-600 text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {camps.length === 0 && (
                    <p className="text-center text-gray-500 mt-6">No camps available to manage.</p>
                )}
            </div>
        </section>
    );
};

export default ManageCamps;
