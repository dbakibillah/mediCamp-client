import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import useAxiosPublic from "./../../hooks/useAxiosPublic";
import { AuthContext } from "../../providers/AuthProviders";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

const CampDetails = () => {
    const { campId } = useParams();
    const [camp, setCamp] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        age: "",
        phone: "",
        gender: "",
        emergencyContact: "",
    });
    const axiosPublic = useAxiosPublic();
    // const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchCampDetails = async () => {
            try {
                const response = await axiosPublic.get(`/camps/${campId}`);
                setCamp(response.data);
            } catch (error) {
                console.error("Error fetching camp details:", error);
            }
        };
        fetchCampDetails();
    }, [campId, axiosPublic]);

    const formatDateTime = (dateTimeString) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        const date = new Date(dateTimeString);
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleJoinCamp = async () => {
        if (!formData.age || !formData.phone || !formData.gender || !formData.emergencyContact) {
            toast.warn("Please fill in all required fields", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            return;
        }

        if (isNaN(formData.age) || formData.age <= 0) {
            toast.warn("Please enter a valid age", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            return;
        }

        try {
            const registrationData = {
                campId,
                campName: camp.name,
                fees: camp.fees,
                location: camp.location,
                healthcareProfessional: camp.healthcareProfessional,
                participantName: user.displayName,
                participantEmail: user.email,
                age: formData.age,
                phone: formData.phone,
                gender: formData.gender,
                emergencyContact: formData.emergencyContact,
            };

            await axiosPublic.post("/joinedParticipant", registrationData);
            await axiosPublic.patch(`/camps/${campId}/increment`);

            Swal.fire({
                title: "Success!",
                text: "You have successfully joined the camp!",
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
            });
            setIsModalOpen(false);
            // navigate(0);
        } catch (error) {
            console.error("Error joining camp:", error);
            alert("Failed to join camp. Please try again.");
        }
    };

    if (!camp) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <p className="text-lg text-gray-700 dark:text-gray-200">Loading...</p>
            </section>
        );
    }

    return (
        <section className="bg-gray-100 dark:bg-gray-900 min-h-screen my-10">
            <div className="container mx-auto lg:px-24 p-6 md:flex">
                <figure className="flex-1 md:pr-6">
                    <img
                        src={camp.image}
                        alt={camp.name}
                        className="rounded-lg w-full object-cover h-80 md:h-full"
                    />
                </figure>
                <div className="flex-1 space-y-6 text-gray-800 dark:text-gray-200">
                    <h1 className="text-3xl font-bold">{camp.name}</h1>
                    <ul className="space-y-2">
                        <li>
                            <span className="font-semibold">Date & Time:</span> {formatDateTime(camp.dateTime)}
                        </li>
                        <li>
                            <span className="font-semibold">Location:</span> {camp.location}
                        </li>
                        <li>
                            <span className="font-semibold">Healthcare Professional:</span>{" "}
                            {camp.healthcareProfessional}
                        </li>
                        <li>
                            <span className="font-semibold">Participants:</span> {camp.participantCount}
                        </li>
                        <li>
                            <span className="font-semibold">Fees:</span> ${camp.fees}
                        </li>
                    </ul>
                    <p className="text-gray-600 dark:text-gray-400">{camp.description}</p>
                    <button
                        className="btn bg-blue-600 text-white w-full md:w-auto"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Join Camp
                    </button>
                </div>
            </div>

            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center>
                <h2 className="text-2xl font-bold mb-4">Register for {camp.name}</h2>
                <form className="space-y-2">

                    <div>
                        <label className="block font-semibold">Camp Name:</label>
                        <input type="text" value={camp.name} readOnly className="input input-bordered w-full" />
                    </div>
                    <div className="flex gap-5">
                        <div className="w-1/2">
                            <label className="block font-semibold">Fees:</label>
                            <input type="text" value={camp.fees} readOnly className="input input-bordered w-full" />
                        </div>
                        <div className="w-1/2">
                            <label className="block font-semibold">Location:</label>
                            <input type="text" value={camp.location} readOnly className="input input-bordered w-full" />
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="w-1/2">
                            <label className="block font-semibold">Participant Name:</label>
                            <input
                                type="text"
                                value={user.displayName}
                                readOnly
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block font-semibold">Email:</label>
                            <input
                                type="email"
                                value={user.email}
                                readOnly
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="w-1/2">
                            <label className="block font-semibold">Age:</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block font-semibold">Gender:</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="w-1/2">
                            <label className="block font-semibold">Phone Number:</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block font-semibold">Emergency Contact:</label>
                            <input
                                type="text"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>
                </form>
                <div className="mt-6 flex gap-4">
                    <button className="btn bg-blue-600 text-white" onClick={handleJoinCamp}>
                        Confirm Registration
                    </button>
                    <button
                        className="btn btn-outline text-blue-600 border-blue-600"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </Modal>

            <ToastContainer />
        </section>
    );
};

export default CampDetails;
