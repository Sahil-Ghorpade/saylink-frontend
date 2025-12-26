import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("saylink_user");
        return storedUser ? JSON.parse(storedUser) : null;
    });


    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem("saylink_user");
    });

    
const login = (authData) => {
    const normalizedUser = {
        ...authData.user,
        _id: authData.user._id || authData.user.id,
    };

    localStorage.setItem("saylink_user", JSON.stringify(normalizedUser));
    localStorage.setItem("saylink_token", authData.token);

    setUser(normalizedUser);
    setIsAuthenticated(true);
};


const updateUser = (updatedUser) => {
    const normalizedUser = {
        ...updatedUser,
        _id: updatedUser._id || updatedUser.id,
    };

    localStorage.setItem("saylink_user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
};


    const logout = () => {
        localStorage.removeItem("saylink_user");
        localStorage.removeItem("saylink_token");

        setUser(null);
        setIsAuthenticated(false);
    };

    

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;