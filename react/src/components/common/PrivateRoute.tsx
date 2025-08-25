import { useUser } from "../../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
    const { user, loading } = useUser();
    if (loading) return null; // O un loader/spinner si prefieres
    return user ? <Outlet /> : <Navigate to="/signin" />;
}
