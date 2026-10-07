import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/products?search=${encodeURIComponent(q.trim())}` : "/products");
  };

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="bg-stone-900 text-stone-100">
        <p className="mx-auto max-w-7xl px-4 py-1.5 text-center text-[12px] tracking-wide">
          Free delivery on orders above ₹499 · COD available
        </p>
      </div>
      <div className="border-b border-stone-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link to="/" className="shrink-0 text-[17px] font-extrabold tracking-tight text-stone-900">
            E-Commerce<span className="text-stone-400">.</span>
          </Link>

          <form onSubmit={submitSearch} className="hidden flex-1 md:block">
            <div className="flex overflow-hidden rounded-md border border-stone-300 bg-stone-50 focus-within:border-stone-500">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for products, brands and more"
                className="w-full bg-transparent px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400"
              />
              <button className="shrink-0 bg-stone-900 px-4 text-sm font-medium text-white hover:bg-stone-800">
                Search
              </button>
            </div>
          </form>

          <nav className="ml-auto flex shrink-0 items-center gap-1 text-sm">
            <Link to="/" className="hidden rounded px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 sm:block">
              Home
            </Link>
            <Link to="/products" className="rounded px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900">
              Products
            </Link>
            <Link to="/orders" className="hidden rounded px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 sm:block">
              Orders
            </Link>
            <Link
              to="/cart"
              className="rounded border border-stone-300 px-3 py-2 font-medium text-stone-900 hover:border-stone-900"
            >
              Cart
            </Link>
            {user ? (
              <span className="ml-1 flex items-center gap-2">
                <span
                  title={user.email}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-xs font-bold uppercase text-white"
                >
                  {(user.name || user.email || "U").slice(0, 1)}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded px-2 py-2 text-stone-500 hover:text-stone-900"
                >
                  Logout
                </button>
              </span>
            ) : (
              <span className="ml-1 flex items-center gap-1">
                <Link to="/login" className="rounded px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded bg-stone-900 px-3 py-2 font-medium text-white hover:bg-stone-800"
                >
                  Sign up
                </Link>
              </span>
            )}
          </nav>
        </div>
        <form onSubmit={submitSearch} className="border-t border-stone-100 px-4 py-2 md:hidden">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm"
          />
        </form>
      </div>
    </header>
  );
};

export default Navbar;
