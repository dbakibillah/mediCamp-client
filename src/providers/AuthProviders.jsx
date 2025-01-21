import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.init";
import Loading from "../pages/common/Loading";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext(null);

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
    const axiosPublic = useAxiosPublic();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const provider = new GoogleAuthProvider();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile);
    };

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, provider);
    };

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signOutUser = () => {
        setLoading(true);
        return signOut(auth).finally(() => setLoading(false));
    };

    const forgotPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Check if the JWT token is already in localStorage
                const token = localStorage.getItem("access-token");
                if (token) {
                    setLoading(false); // Skip axios call if the token is available
                } else {
                    const userData = { email: currentUser.email };
                    axiosPublic.post("/jwt", userData)
                        .then((response) => {
                            localStorage.setItem("access-token", response.data.token);
                            setLoading(false);
                        })
                        .catch((error) => {
                            console.error("Error during JWT request:", error);
                            setLoading(false);
                        });
                }
            } else {
                setUser(null);
                // Log out the user from the server if needed
                axiosPublic.post("/logout")
                    .then(() => {
                        localStorage.removeItem("access-token");
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("Error during logout request:", error);
                        setLoading(false);
                    });
            }
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        setUser,
        createUser,
        googleSignIn,
        updateUserProfile,
        signInUser,
        signOutUser,
        loading,
        forgotPassword
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {loading ? <Loading /> : children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
