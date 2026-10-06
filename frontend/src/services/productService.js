import { api } from "./api";

const getAllProducts = async(params = {})=>{
    const response = await api.get("/products" ,{params});
    return response.data;
}


const getProductById = async(id)=>{
    const response = await api.get(`/products/${id}` );
    return response.data;
};


export {getAllProducts,getProductById};