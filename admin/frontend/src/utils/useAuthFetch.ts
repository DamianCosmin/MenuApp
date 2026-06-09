import { useAuth } from "@clerk/react";

export function useAuthFetch() {
    const { getToken } = useAuth();
    
    const authFetch = async (url: string, options: RequestInit = {}) => {
        const token = await getToken();

        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...options.headers,
            }
        })
    }

    return authFetch;
}