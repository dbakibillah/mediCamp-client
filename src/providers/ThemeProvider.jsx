import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem("darkMode");
        return storedTheme === "true";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
