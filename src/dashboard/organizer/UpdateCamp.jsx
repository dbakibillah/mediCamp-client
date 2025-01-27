import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../pages/common/Loading";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const UpdateCamp = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(true);

    const { data: camp, isLoading } = useQuery({
        queryKey: ["camp", id],
        queryFn: async () => {
            const response = await axiosSecure.get(`/camps/${id}`);
            return response.data;
        },
    });

    useEffect(() => {
        if (camp) {
            Object.entries(camp).forEach(([key, value]) => setValue(key, value));
            setLoading(false);
        }
    }, [camp, setValue]);

    if (isLoading) {
        return <Loading />;
    }

    const onSubmit = async (data) => {
        try {
            const { _id, ...updatedData } = data;
            await axiosSecure.put(`/update-camp/${id}`, updatedData);

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
            <div className="max-w-2xl mx-auto bg-base-100 dark:bg-gray-800 shadow-xl rounded-lg p-8">
                <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">Update Camp</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Camp Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold dark:text-white">Camp Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter camp name"
                            {...register("campName", { required: "Camp name is required" })}
                            className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
                        />
                        {errors.campName && (
                            <span className="text-error text-sm">{errors.campName.message}</span>
                        )}
                    </div>

                    <div className="md:flex gap-6">
                        {/* Camp Fees */}
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text font-semibold dark:text-white">Camp Fees</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Enter camp fees"
                                {...register("fees", {
                                    required: "Camp fees are required",
                                    min: { value: 0, message: "Fees cannot be negative" },
                                })}
                                className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
                            />
                            {errors.fees && (
                                <span className="text-error text-sm">{errors.fees.message}</span>
                            )}
                        </div>

                        {/* Image URL */}
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text font-semibold dark:text-white">Photo</span>
                            </label>
                            <input
                                type="file"
                                className="file-input file-input-bordered w-full dark:bg-gray-700 dark:text-white"
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
                                <span className="label-text font-semibold dark:text-white">Location</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter camp location"
                                {...register("location", { required: "Location is required" })}
                                className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
                            />
                            {errors.location && (
                                <span className="text-error text-sm">{errors.location.message}</span>
                            )}
                        </div>

                        {/* Date & Time */}
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text font-semibold dark:text-white">Date & Time</span>
                            </label>
                            <input
                                type="datetime-local"
                                {...register("dateTime", { required: "Date & time are required" })}
                                className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
                            />
                            {errors.dateTime && (
                                <span className="text-error text-sm">{errors.dateTime.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Healthcare Professional Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold dark:text-white">Healthcare Professional Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter professional name"
                            {...register("professionalName", {
                                required: "Healthcare professional name is required",
                            })}
                            className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
                        />
                        {errors.professionalName && (
                            <span className="text-error text-sm">{errors.professionalName.message}</span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold dark:text-white">Description</span>
                        </label>
                        <textarea
                            placeholder="Enter camp description"
                            {...register("description", { required: "Description is required" })}
                            className="textarea textarea-bordered w-full dark:bg-gray-700 dark:text-white"
                        ></textarea>
                        {errors.description && (
                            <span className="text-error text-sm">{errors.description.message}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="form-control mt-6">
                        <button type="submit" className="btn bg-gradient-to-r from-blue-600 to-blue-800 hover:bg-gradient-to-l border-none text-white w-full">
                            Update Camp
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UpdateCamp;
