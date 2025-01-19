import { useContext, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../providers/AuthProviders";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: userType, isLoading, isError } = useQuery({
        queryKey: ["userType", user?.email],
        queryFn: async () => {
            if (user?.email) {
                const response = await axiosSecure.get(`/user-type?email=${user.email}`);
                return response.data.type;
            }
            return null;
        },
        enabled: !!user?.email,
        onError: (error) => {
            console.error("Error fetching user type:", error);
        },
    });

    useEffect(() => {
        if (userType === "organizer") {
            navigate("/dashboard/organizer-profile");
        } else if (userType === "participant") {
            navigate("/dashboard/analytics");
        }
    }, [userType, navigate]);

    const organizerLinks = (
        <>
            <li>
                <NavLink
                    to="/dashboard/organizer-profile"
                    className={({ isActive }) =>
                        `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
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
                        `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                        }`
                    }
                >
                    Add A Camp
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/manage-camps"
                    className={({ isActive }) =>
                        `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                        }`
                    }
                >
                    Manage Camps
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/manage-registrations"
                    className={({ isActive }) =>
                        `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                        }`
                    }
                >
                    Manage Registered Camps
                </NavLink>
            </li>
        </>
    );

    const participantsLinks = (
        <>
            <li>
                <NavLink
                    to="/dashboard/analytics"
                    className={({ isActive }) =>
                        `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                        }`
                    }
                >
                    Analytics
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/participant-profile"
                    className={({ isActive }) =>
                        `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                        }`
                    }
                >
                    Participant Profile
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/registered-camps"
                    className={({ isActive }) =>
                        `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                        }`
                    }
                >
                    Registered Camps
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/payment-history"
                    className={({ isActive }) =>
                        `block px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"
                        }`
                    }
                >
                    Payment History
                </NavLink>
            </li>
        </>
    );

    return (
        <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="lg:w-2/12 w-full lg:h-auto h-1/5 bg-blue-600 dark:bg-gray-950 text-white flex flex-col shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <nav>
                        <ul className="space-y-2">
                            {userType === "organizer"
                                ? organizerLinks
                                : userType === "participant"
                                    ? participantsLinks
                                    : isLoading
                                        ? <li>Loading...</li>
                                        : isError
                                            ? <li>Error loading links</li>
                                            : null}
                        </ul>
                    </nav>
                    {/* Divider */}
                    <div className="divider"></div>
                    <nav>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="block px-5 py-3 rounded-lg transition-all hover:bg-blue-700"
                                >
                                    Home
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:w-10/12 w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg">
                <Outlet />
            </div>
        </section>
    );
};

export default Dashboard;
