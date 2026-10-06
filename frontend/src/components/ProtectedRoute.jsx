import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({children}){
    const{user,loading} = useAuth();

    if(loading) return <p>Loading...</p>;
    if(!user) return <Navigate to="/Login" replace />
    return children;
    
}