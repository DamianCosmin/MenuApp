import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router";

export function useAuthFetch() {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    
    const authFetch = async (url: string, options: RequestInit = {}) => {
        const token = await getToken();

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...options.headers,
            }
        });

        if (response.status === 401) {
            navigate("/login");
            throw new Error("Unauthorized! Please log in!");
        }

        return response;
    }

    return authFetch;
}