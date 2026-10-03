import { api } from "./api";

// Register
const registerUser = async (userData)=>{
    const response = await api.post("/users/register" , userData  );
    return response.data;
};

const loginUser = async (userData)=>{
    const response = await api.post("/users/login" , userData  );
    return response.data;
}

const logoutUser = async (userData)=>{
    const response = await api.post("/users/logout" , userData  );
    return response.data;
}

const getCurrentUser = async (userData)=>{
    const response = await api.get("/users/me" , userData  );
    return response.data;
};


export {registerUser, loginUser,logoutUser,getCurrentUser};