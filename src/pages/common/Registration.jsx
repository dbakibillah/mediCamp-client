import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../providers/AuthProviders";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Helmet } from "react-helmet";

const Registration = () => {
    const img_hosting_key = import.meta.env.VITE_IMG_HOSTING_KEY;
    const img_hosting_api = `https://api.imgbb.com/1/upload?key=${img_hosting_key}`;
    const { register, handleSubmit, formState: { errors } } = useForm();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const { createUser, setUser, updateUserProfile, googleSignIn } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(async (result) => {
                const user = result.user;
                setUser(user);

                const newUser = {
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                };

                try {
                    const response = await axiosPublic.get(`/user?email=${user.email}`);
                    if (response.data.exists) {
                        Swal.fire({
                            title: "Welcome back!",
                            text: "You are already registered.",
                            icon: "info",
                        });
                    } else {
                        await axiosPublic.post("/users", newUser);
                        Swal.fire({
                            title: "Good job!",
                            text: "Registration successful with Google!",
                            icon: "success",
                        });
                    }
                    navigate(location.state?.from?.pathname || "/", { replace: true });
                } catch (error) {
                    console.error("Error handling Google sign-in:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Something went wrong!",
                        text: error.message,
                    });
                }
            })
            .catch((err) => {
                Swal.fire({
                    title: "Something went wrong!",
                    text: err.message,
                    icon: "error",
                });
            });
    };

    const onSubmit = async (data) => {
        const { name, email, password } = data;

        try {
            const response = await axiosPublic.get(`/user?email=${email}`);
            if (response.data.exists) {
                Swal.fire({
                    title: "Already registered!",
                    text: "Please log in instead.",
                    icon: "info",
                });
                navigate("/login");
                return;
            }

            const result = await createUser(email, password);
            setUser(result.user);

            const formData = new FormData();
            formData.append("image", data.photo[0]);
            const imgResponse = await axiosPublic.post(img_hosting_api, formData);

            if (!imgResponse.data.success) {
                Swal.fire({
                    icon: "error",
                    title: "Image Upload Failed",
                    text: "Please try again.",
                });
                return;
            }

            const updateUser = {
                displayName: name,
                photoURL: imgResponse.data.data.display_url,
            };
            await updateUserProfile(updateUser);

            const newUser = { name, email, photo: updateUser.photoURL };
            await axiosPublic.post("/users", newUser);

            navigate("/");
            Swal.fire({
                title: "Good job!",
                text: "Registration successful!",
                icon: "success",
            });
        } catch (error) {
            console.error("Error during registration:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to register",
                text: error.message,
            });
        }
    };

    return (
        <section className="bg-base-100 p-2 py-10 lg:py-16 dark:bg-gray-900">
            <Helmet>
                <title>mediCamp | Registration</title>
            </Helmet>
            <div className="dark:bg-gray-800 card w-full max-w-sm shadow-2xl mx-auto animate__animated animate__bounceInDown animate__slow dark:text-white">
                <h2 className="text-3xl font-bold text-center text-c3 mt-4 dark:text-white">Registration</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text dark:text-white">Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Name"
                            className="input input-bordered dark:text-gray-950"
                            {...register("name", { required: "Name is required." })}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text dark:text-white">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="input input-bordered dark:text-gray-950"
                            {...register("email", {
                                required: "Email is required.",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email format." },
                            })}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text dark:text-white">Photo</span>
                        </label>
                        <input
                            type="file"
                            className="file-input file-input-bordered w-full max-w-xs"
                            {...register("photo", { required: "Photo is required." })}
                        />
                        {errors.photo && <p className="text-red-500 text-sm">{errors.photo.message}</p>}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text dark:text-white">Password</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="input input-bordered w-full dark:text-gray-950"
                                {...register("password", {
                                    required: "Password is required.",
                                    minLength: { value: 6, message: "Password must be at least 6 characters." },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                                        message: "Password must include uppercase, lowercase, number, and special character.",
                                    },
                                })}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 cursor-pointer text-gray-500 text-2xl"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <div className="form-control mt-6">
                        <button type="submit" className="btn bg-blue-600 text-white border-none">
                            Register
                        </button>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleGoogleSignIn}
                            type="button"
                            className="btn w-full flex items-center gap-3 bg-white border text-black hover:bg-gray-200"
                        >
                            <img
                                src="https://i.ibb.co/WnqDNrk/google.png"
                                alt="Google Icon"
                                className="w-5 h-5"
                            />
                            Continue with Google
                        </button>
                    </div>

                    <div className="mt-2">
                        <p className="text-center text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="link link-hover text-c2 font-bold">
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Registration;
