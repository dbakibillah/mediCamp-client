import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";
import Loading from "../pages/Loading";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    if (loading) {
        return <Loading />
    }
    if (user) {
        return children
    }
    return <Navigate state={location.pathname} to="/login" />;
};

export default PrivateRoute;