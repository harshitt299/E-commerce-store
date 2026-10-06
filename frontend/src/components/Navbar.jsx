import { useAuth } from '../hooks/useAuth';
import { Link ,Navigate, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const {user , logout} = useAuth();
  const navigate = useNavigate()
  const handlelogout = async ()=>{
    await logout();
    navigate("/")
  }
  return (
    <nav>
      <Link to="/">E-Commerce</Link>
    <div>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/cart">Cart</Link>

      {user ? (
        <>
        <span>{user.name}</span>
        <button onClick={handlelogout}>Logout</button>
        </>
      ):(
        <>
        <Link to ="/register">Register</Link>
        <Link to = "/login">Login</Link>
        </>
        
      )}
  

    </div>
   </nav>
  )
}

export default Navbar;
