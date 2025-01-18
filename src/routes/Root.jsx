import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";


const Root = () => {
    return (
        <section className="bg-gray-100 dark:bg-gray-900">
           <Navbar />
           <Outlet />
           <Footer />
        </section>
    );
};

export default Root;