import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";


const Root = () => {
    return (
        <section>
           <Navbar />
           <Outlet />
        </section>
    );
};

export default Root;