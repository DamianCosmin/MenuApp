import { useAuth } from "@clerk/react";
import { Navigate } from "react-router";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return null;
    }

    if (isSignedIn) {
        return <Navigate to={"/"} replace />
    }

    return <>{children}</>
}