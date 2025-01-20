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
            setUser(currentUser);

            if (currentUser?.email) {
                const user = { email: currentUser.email }
                axiosPublic.post("/jwt", user, {
                    withCredentials: true
                })
                    .then((response) => {
                        localStorage.setItem("access-token", response.data.token);
                        setLoading(false);
                    })
            }
            else {
                axiosPublic.post("/logout", {
                    withCredentials: true
                })
                    .then((response) => {
                        localStorage.removeItem("access-token");
                        setLoading(false);
                    })
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
