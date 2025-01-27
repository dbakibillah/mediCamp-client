import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";


const Root = () => {
    return (
        <section className="bg-gray-100 dark:bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
           <Navbar />
           <Outlet />
           <Footer />
        </section>
    );
};

export default Root;