import React, { createContext, ReactNode, useContext, useState } from "react";
import type { APIResponse } from "../types";

const logoutEndpoint = "/api/auth/logout";

interface AuthContextType {
    user: APIResponse["USER_PROFILE"] | null;
    login: (userData: APIResponse["USER_PROFILE"] | null) => void;
    logout: () => void;
}

// Create Auth Context

const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<APIResponse["USER_PROFILE"] | null>(null);

    const login = (userData: APIResponse["USER_PROFILE"] | null) => {
        if (!userData) return;
        setUser(userData);
    };

    const logout = async () => {
        setUser(null);
        const response = await fetch(logoutEndpoint, { method: "POST" });

        return response.ok ? true : false;
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

// Custom hook to use AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
