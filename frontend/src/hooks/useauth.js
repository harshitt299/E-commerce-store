import { Authcontext } from "../context/AuthContext";
import { useContext } from "react";

const useAuth = ()=>{
    return (
        useContext(Authcontext)
    )

};

export {useAuth};