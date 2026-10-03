import { createContext,useContext,useEffect,useState } from "react";

import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
} from "../services/authService";
import axios from "axios";


const Authcontext = createContext();


function AuthProvider ({children}){
    const [user ,setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // check current user
    const checkUser = async()=>{
        try {
            const response = await getCurrentUser();

            setUser(response.user)
        } catch (error) {
            setUser(null)
        }
        finally{
            setLoading(false);
        }
    };



    // Register

    const register = async(userData)=>{
        try {
            const response = await registerUser(userData);
            setUser(response.user);
            return response;
        } catch (error) {
            setUser(null);
        }
    }

    // login
    const login = async (userData)=>{
        try {
            const response =  await loginUser(userData);
            setUser(response.user)
            return response;
        } catch (error) {
            setUser(null);
        }
    }

    //logout
       const logout = async () => {
        const response = await logoutUser();

        setUser(null);

        return response;
    };

    // check user when app starts
    useEffect(()=>{
        checkUser();
    },[]);

    return (
        <Authcontext.Provider value={{user,loading,register,login,logout}}>
            {children}
        </Authcontext.Provider>
    )
}

export {AuthProvider,Authcontext};