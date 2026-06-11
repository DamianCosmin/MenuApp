import { useAuth } from "@clerk/react";
import { Navigate } from "react-router";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return null;
    }

    if (!isSignedIn) {
        return <Navigate to={"/login"} replace />
    }

    return <>{children}</>
}