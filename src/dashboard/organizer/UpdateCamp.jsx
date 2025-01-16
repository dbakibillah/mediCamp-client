import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../pages/common/Loading";

const UpdateCamp = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/camps/${id}`);
                const camp = response.data;
                Object.entries(camp).forEach(([key, value]) => setValue(key, value));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching camp details:", error);
                Swal.fire("Error", "Failed to load camp details.", "error");
                navigate("/dashboard/manage-camps");
            }
        };
        fetchCampDetails();
    }, [id, setValue, navigate]);

    const onSubmit = async (data) => {
        try {
            const { _id, ...updatedData } = data;
            await axios.put(`http://localhost:5000/update-camp/${id}`, updatedData);

            Swal.fire("Success", "Camp updated successfully!", "success");
            navigate("/dashboard/manage-camps");
        } catch (error) {
            console.error("Error updating camp:", error);
            Swal.fire("Error", "Failed to update the camp.", "error");
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <section className="container mx-auto px-4 py-10 lg:my-20">
            <div className="max-w-2xl mx-auto bg-base-100 shadow-xl rounded-lg p-8">
                <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">Update Camp</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Camp Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Camp Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter camp name"
                            {...register("campName", { required: "Camp name is required" })}
                            className="input input-bordered w-full"
                        />
                        {errors.campName && (
                            <span className="text-error text-sm">{errors.campName.message}</span>
                        )}
                    </div>

                    <div className="md:flex gap-6">
                        {/* Camp Fees */}
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text font-semibold">Camp Fees</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Enter camp fees"
                                {...register("fees", {
                                    required: "Camp fees are required",
                                    min: { value: 0, message: "Fees cannot be negative" },
                                })}
                                className="input input-bordered w-full"
                            />
                            {errors.fees && (
                                <span className="text-error text-sm">{errors.fees.message}</span>
                            )}
                        </div>

                        {/* Image URL */}
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text font-semibold">Photo</span>
                            </label>
                            <input
                                type="file"
                                className="file-input file-input-bordered w-full"
                                {...register("photo", { required: "Photo is required" })}
                            />
                            {errors.photo && (
                                <span className="text-error text-sm">{errors.photo.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="md:flex gap-6">
                        {/* Location */}
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text font-semibold">Location</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter camp location"
                                {...register("location", { required: "Location is required" })}
                                className="input input-bordered w-full"
                            />
                            {errors.location && (
                                <span className="text-error text-sm">{errors.location.message}</span>
                            )}
                        </div>

                        {/* Date & Time */}
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text font-semibold">Date & Time</span>
                            </label>
                            <input
                                type="datetime-local"
                                {...register("dateTime", { required: "Date & time are required" })}
                                className="input input-bordered w-full"
                            />
                            {errors.dateTime && (
                                <span className="text-error text-sm">{errors.dateTime.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Healthcare Professional Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Healthcare Professional Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter professional name"
                            {...register("professionalName", {
                                required: "Healthcare professional name is required",
                            })}
                            className="input input-bordered w-full"
                        />
                        {errors.professionalName && (
                            <span className="text-error text-sm">{errors.professionalName.message}</span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Description</span>
                        </label>
                        <textarea
                            placeholder="Enter camp description"
                            {...register("description", { required: "Description is required" })}
                            className="textarea textarea-bordered w-full"
                        ></textarea>
                        {errors.description && (
                            <span className="text-error text-sm">{errors.description.message}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="form-control mt-6">
                        <button type="submit" className="btn bg-blue-600 text-white w-full">
                            Update Camp
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UpdateCamp;
