import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";


const Root = () => {
    return (
        <section className="bg-gray-100 dark:bg-gray-900">
           <Navbar />
           <Outlet />
        </section>
    );
};

export default Root;