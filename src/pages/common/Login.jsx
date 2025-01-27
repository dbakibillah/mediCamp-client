import { Link, useLocation, useNavigate } from "react-router-dom";
import 'animate.css';
import { useContext, useState } from "react";
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../providers/AuthProviders";
import axios from "axios";
import { Helmet } from "react-helmet";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signInUser, setUser, googleSignIn } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
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
                    const response = await axios.get(`https://medi-camp-server-one.vercel.app/user?email=${user.email}`);
                    if (response.data.exists) {
                        Swal.fire({
                            title: "Welcome back!",
                            text: "You are already registered.",
                            icon: "info",
                        });
                    } else {
                        await axios.post("https://medi-camp-server-one.vercel.app/users", newUser);
                        Swal.fire({
                            title: "Good job!",
                            text: "Registration successfully with Google!",
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

    const onSubmit = (data) => {
        const { email, password } = data;

        signInUser(email, password)
            .then(result => {
                setUser(result.user);
                const redirectPath = location.state || "/";
                navigate(redirectPath, { replace: true });
                Swal.fire({
                    title: "Good job!",
                    text: "Logged in successfully!",
                    icon: "success"
                });
            })
            .catch(err => {
                Swal.fire({
                    title: "Something went wrong!",
                    text: err.message,
                    icon: "error"
                });
            });
    };

    return (
        <section className="bg-base-100 py-36 dark:bg-gray-900">
            <Helmet>
                <title>Login | MediCamp</title>
            </Helmet>
            <div className="card w-full max-w-sm shadow-2xl mx-auto animate__animated animate__bounceInDown animate__slow dark:bg-gray-800">
                <h2 className="text-3xl font-bold text-center p-5 text-c3 dark:text-white">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text dark:text-white">Email</span>
                        </label>
                        <input
                            {...register("email", { required: "Email is required" })}
                            type="email"
                            placeholder="Email"
                            className="input input-bordered dark:bg-gray-700 dark:text-gray-100"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text dark:text-white">Password</span>
                        </label>
                        <div className="relative">
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters long",
                                    },
                                })}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 cursor-pointer text-gray-500 text-2xl"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="form-control mt-6">
                        <button type="submit" className="btn bg-gradient-to-r from-blue-600 to-blue-800 hover:bg-gradient-to-l text-white border-none">
                            Login
                        </button>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleGoogleSignIn}
                            type="button"
                            className="btn w-full flex items-center gap-3 bg-gradient-to-r from-gray-100 to-gray-300 hover:bg-gradient-to-l text-black hover:bg-gray-200"
                        >
                            <img
                                src="https://i.ibb.co/WnqDNrk/google.png"
                                alt="Google Icon"
                                className="w-5 h-5"
                            />
                            Continue with Google
                        </button>
                    </div>

                    <div className="mt-4 text-center dark:text-white">
                        <p className="text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to="/register" className="link link-hover text-c2 font-bold text-blue-600">
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Login;
