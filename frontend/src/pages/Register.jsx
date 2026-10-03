import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {Link , useNavigate } from "react-router-dom";

function Register() {

  const [formData, setFormData] =useState({
    name : "",
    email : "",
    password : "",
   
  });

  const  {register} = useAuth();
  const navigate = useNavigate();


  const handlechange = (e)=>{
    const {name ,value} = e.target;
    setFormData({
      ...formData ,
      [name] : value,
    });
  };


  const handleSumbit = async(e)=>{
    e.preventDefault();

    try {
      const response = await register(formData);
      console.log(response);
      navigate("/");
    } catch (error) {
      console.log(error)

    }
  }
  return (
    <div>
      <form onSubmit={handleSumbit}>
    <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handlechange} />
    <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handlechange} />
    <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handlechange} />

    <button type="submit">
                    Register
                </button>

      </form>
      <p>
         Already have an account?

           <Link to="/login">
                    Login
            </Link>
      </p>
    </div>
  )
}

export default Register
