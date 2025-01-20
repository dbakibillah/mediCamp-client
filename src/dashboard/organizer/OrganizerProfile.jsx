import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const OrganizerProfile = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.displayName || "",
        photoURL: user?.photoURL || "",
        contact: "",
    });

    const { data: userData, isLoading, isError } = useQuery({
        queryKey: ['userData', user?.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/user/${user.email}`);
            return response.data;
        }
    });
    useEffect(() => {
        if (userData) {
            setProfileData((prev) => ({
                ...prev,
                contact: userData.contact || "",
            }));
        }
    }, [userData]);
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching user data.</p>;

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosSecure.put(`/user/${user.email}`, profileData);
            if (response.data.modifiedCount > 0) {
                Swal.fire({
                    icon: "success",
                    title: "Profile updated successfully",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setIsEditing(false);
            } else {
                Swal.fire({
                    icon: "info",
                    title: "No changes were made",
                    text: "Your profile is already up to date.",
                });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to update profile",
                text: "Please try again later.",
            });
        }
    };

    return (
        <section className="container mx-auto lg:px-24 p-6">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 dark:text-gray-100">Profile</h2>
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                <figure className="lg:w-1/6">
                    <img
                        src={profileData.photoURL}
                        alt="Profile"
                        className="w-full rounded-full object-cover border"
                    />
                </figure>
                <div className="flex flex-col gap-4 p-6 lg:w-3/6">
                    {!isEditing ? (
                        <div className="lg:w-full space-y-3">
                            <h2 className="text-2xl font-semibold dark:text-gray-100">Name: {profileData.name}</h2>
                            <p className="text-lg dark:text-gray-300">Email: {user?.email || "N/A"}</p>
                            <p className="text-lg dark:text-gray-300">Contact: {profileData.contact || "N/A"}</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Update Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:text-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Photo URL</label>
                                <input
                                    type="text"
                                    name="photoURL"
                                    value={profileData.photoURL}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:text-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">Contact</label>
                                <input
                                    type="text"
                                    name="contact"
                                    value={profileData.contact}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg border dark:bg-gray-800 dark:text-gray-100"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OrganizerProfile;
