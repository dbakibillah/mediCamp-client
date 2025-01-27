import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <section className="md:h-screen flex flex-col justify-center items-center space-y-3 lg:space-y-8 p-5 lg:p-36">
            <iframe className="w-full" width="500" height="500" src="https://lottie.host/embed/99fae093-2dbd-454b-b5a3-4a7874ea9774/MPKMGCzJAM.json"></iframe>

            <p className="text-center text-xl lg:text-3xl font-bold">Oops! An error occurred</p>
            <Link to="/" className="btn ">Back to Home</Link>
        </section>
    );
};

export default ErrorPage;