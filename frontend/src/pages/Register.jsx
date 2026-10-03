import { useState } from "react";
import { useAuth } from "../hooks/useauth";
import {Link , useNavigate } from "react-router-dom";

function Register() {

  const [formData, setFormData] =useState({
    name : "",
    email : "",
    password : "",
   
  });

  const  {Register} = useAuth();
  const {navigate} = useNavigate();


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
      const response = await Register(formData);
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

      </form>
    </div>
  )
}

export default Register
