import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProviders";

const AddCamp = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();
    const img_hosting_key = import.meta.env.VITE_IMG_HOSTING_KEY;
    const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        if (!data.photo[0]) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Photo is required.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("image", data.photo[0]); // Ensure this is the correct file

        const loading = Swal.fire({
            title: "Uploading...",
            text: "Please wait while we upload your image.",
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            // Upload image to ImgBB
            const imgResponse = await axiosPublic.post(img_hosting_api, formData);

            if (imgResponse && imgResponse.data && imgResponse.data.success) {
                const imageUrl = imgResponse.data.data.url;

                // Add the image URL to the data
                const campData = {
                    ...data,
                    image: imageUrl,
                    participantCount: 0,
                    addedBy: user.displayName,
                    organizerEmail: user.email,
                };
                delete campData.photo;

                // Save camp data to the server
                const response = await axiosSecure.post("/camps", campData);

                Swal.close();

                if (response && response.data && response.data.insertedId) {
                    Swal.fire({
                        icon: "success",
                        title: "Camp added successfully!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    reset();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Failed to add camp",
                        text: "Please try again later.",
                    });
                }
            } else {
                Swal.close();
                Swal.fire({
                    icon: "error",
                    title: "Image Upload Failed",
                    text: "Could not upload the image. Please try again.",
                });
            }
        } catch (error) {
            Swal.close();
            console.error("Error adding camp:", error);

            // If there's no response, log the error details
            if (error.response) {
                console.error("API Error Response:", error.response);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Error: ${error.response.status} - ${error.response.data.message || error.message}`,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Something went wrong. Please try again later.",
                });
            }
        }
    };


    return (
        <section className="container mx-auto px-4 py-10 lg:my-20">
            <div className="max-w-2xl mx-auto bg-base-100 dark:bg-gray-800 shadow-xl rounded-lg p-8">
                <h2 className="text-4xl font-bold text-center mb-6 text-gray-800 dark:text-white">Add A Camp</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Camp Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-800 dark:text-white">Camp Name</span>
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

                    <div className="md:flex gap-4">
                        {/* Camp Fees */}
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text text-gray-800 dark:text-white">Camp Fees</span>
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
                                <span className="label-text text-gray-800 dark:text-white">Photo</span>
                            </label>
                            <input
                                type="file"
                                className="file-input file-input-bordered w-full max-w-xs dark:bg-gray-700 dark:text-white"
                                {...register("photo", { required: "Photo is required." })}
                            />
                            {errors.photo && <p className="text-red-500 text-sm">{errors.photo.message}</p>}
                        </div>
                    </div>

                    <div className="md:flex gap-4">
                        {/* Location */}
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text text-gray-800 dark:text-white">Location</span>
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
                                <span className="label-text text-gray-800 dark:text-white">Date & Time</span>
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
                            <span className="label-text text-gray-800 dark:text-white">Healthcare Professional Name</span>
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
                            <span className="text-error text-sm">
                                {errors.professionalName.message}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-gray-800 dark:text-white">Description</span>
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
                        <button
                            type="submit"
                            className="btn bg-gradient-to-r from-green-600 to-green-700 text-white dark:text-gray-800 hover:bg-gradient-to-l border-none"
                        >
                            Add Camp
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AddCamp;
