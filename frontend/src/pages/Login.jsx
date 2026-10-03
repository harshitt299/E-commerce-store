import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {Link , useNavigate } from "react-router-dom";
function Login () {

  const [formData , setFormData] = useState({
    email : "",
    password : ""
  });

  const {login} = useAuth();
  const navigate = useNavigate();

  const handleChange = (e)=>{
   const {name ,value} = e.target;
   setFormData ({
    ...formData , 
    [name] : value
   });
  };


  const handleSubmit = async(e)=>{
    e.preventDefault();

    try {
      const response = await login(formData);
      console.log(response);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div>
     <form onSubmit={handleSubmit}>
      <input 
      type="email" 
      name="email"
       placeholder="Enter Your email"
        value={formData.email}
         onChange={handleChange}
         />

      <input 
      type="password" 
      name="password" 
      placeholder="Enter Your password" 
      value={formData.password} 
      onChange={handleChange} 
      />
      <button type="submit">Login</button>

     </form>


     <p>
        Don't have an account?
         <Link
           to="/register">Register
         </Link>

       </p>


    </div>
  )
}

export default Login;
