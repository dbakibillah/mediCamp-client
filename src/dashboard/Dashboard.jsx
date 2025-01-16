import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";
import axios from "axios";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [userType, setUserType] = useState("");

    useEffect(() => {
        const fetchUserType = async () => {
            try {
                if (user?.email) {
                    const response = await axios.get(`http://localhost:5000/user-type?email=${user.email}`);
                    setUserType(response.data.type);
                }
            } catch (error) {
                console.error("Error fetching user type:", error);
            }
        };
        fetchUserType();
    }, [user]);


    const organizerLinks = <>
        <li>
            <NavLink
                to="/dashboard/organizer-profile"
                className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Organizer Profile
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/dashboard/add-camp"
                className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Add A Camp
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/manage-camps"
                className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Manage Camps
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/manage-registered-camps"
                className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                    }`
                }
            >
                Manage Registered Camps
            </NavLink>
        </li>
    </>

    return (
        <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="lg:w-2/12 w-full lg:h-auto h-1/5 bg-blue-600 text-white flex flex-col shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <nav>
                        <ul className="space-y-4">
                            {userType === "organizer" && <>
                                {organizerLinks}</>}
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:w-10/12 w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg">
                <Outlet />
            </main>
        </section>
    );
};

export default Dashboard;
