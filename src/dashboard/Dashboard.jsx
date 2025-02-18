import { useContext, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../providers/AuthProviders";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { IoMdAddCircleOutline, IoMdAnalytics } from "react-icons/io";
import { AiOutlineFileAdd } from "react-icons/ai";
import { FaHome, FaRegUser, FaUserAlt } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { MdFeedback, MdManageHistory, MdOutlineFeedback, MdPayments } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";

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
            navigate("/dashboard/organizer-dashboard");
        } else if (userType === "participant") {
            navigate("/dashboard/analytics");
        }
    }, [userType, navigate]);

    const organizerLinks = (
        <>
            <li>
                <NavLink
                    to="/dashboard/organizer-dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
                    }
                >
                    <RxDashboard className="text-xl transition-all" /> Dashboard
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/organizer-profile"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
                    }
                >
                    <FaRegUser className="text-xl transition-all" /> Organizer Profile
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/add-camp"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
                    }
                >
                    <IoMdAddCircleOutline className="text-2xl transition-all" /> Add A Camp
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/manage-camps"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
                    }
                >
                    <MdManageHistory className="text-xl transition-all" /> Manage Camps
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/manage-registrations"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
                    }
                >
                    <AiOutlineFileAdd className="text-xl transition-all" /> Manage Registered Camps
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/manage-feedbacks"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
                    }
                >
                    <MdOutlineFeedback className="text-xl transition-all" /> Manage Feedbacks
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
                        `px-5 py-3 rounded-lg transition-all flex items-center gap-3 ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
                    }
                >
                    <IoMdAnalytics className="text-xl transition-all" /> Analytics
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/participant-profile"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
                    }
                >
                    <FaUserAlt className="text-lg transition-all" /> Participant Profile
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/registered-camps"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
                    }
                >
                    <FaUserPen className="text-2xl transition-all" /> Registered Camps
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/payment-history"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
                    }
                >
                    <MdPayments className="text-2xl transition-all" /> Payment History
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/dashboard/your-feedback"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-5 py-3 rounded-lg transition-all ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
                    }
                >
                    <MdFeedback className="text-2xl transition-all" /> Your Feedback
                </NavLink>
            </li>
        </>
    );

    return (
        <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="lg:w-2/12 w-full lg:h-auto h-1/5 bg-gradient-to-b from-blue-600 via-indigo-600 to-indigo-800 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 text-white flex flex-col shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-100">Dashboard</h2>
                    <nav>
                        <ul className="space-y-2">
                            {userType === "organizer"
                                ? organizerLinks
                                : userType === "participant"
                                    ? participantsLinks
                                    : isLoading
                                        ? <li className="text-gray-500">Loading...</li>
                                        : isError
                                            ? <li className="text-red-500">Error loading links</li>
                                            : null}
                        </ul>
                    </nav>
                    {/* Divider */}
                    <div className="my-6 border-t border-gray-700"></div>
                    <nav>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="flex items-center gap-3 px-5 py-3 rounded-lg transition-all hover:bg-blue-700"
                                >
                                    <FaHome className="text-xl transition-all" /> Home
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:w-10/12 w-full bg-gray-100 dark:bg-gradient-to-br from-gray-800 to-gray-900 text-gray-900 dark:text-gray-100 shadow-lg p-6">
                <Outlet />
            </div>
        </section>
    );
};

export default Dashboard;
