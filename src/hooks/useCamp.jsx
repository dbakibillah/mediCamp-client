import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProviders";

const useCamp = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const { refetch, data: camp = [] } = useQuery({
        queryKey: ['camp', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/camps?email=${user.email}`);
            return res.data;
        }
    })

    return [camp, refetch];
};

export default useCamp;