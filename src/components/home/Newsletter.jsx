import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Newsletter = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!email || !/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            toast.error("Please enter a valid email address.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        toast.success("Thank you for subscribing to our newsletter!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });

        setEmail("");
    };

    return (
        <section className="p-2 lg:px-12 py-12">
            <div className="container mx-auto lg:w-3/4 bg-gray-200 py-8 px-4 dark:bg-gray-900 rounded-lg md:py-12 md:px-24 shadow-xl">
                <div className="max-w-lg mx-auto">
                    <figure className="flex justify-center mb-4 w-1/2 mx-auto">
                        <img
                            src="https://i.ibb.co.com/H7VFSVB/vecteezy-3d-open-mail-icon-12627941.png"
                            alt="Newsletter Icon"
                        />
                    </figure>

                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
                        Subscribe to our Newsletter
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input w-full input-bordered px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </section>
    );
};

export default Newsletter;
