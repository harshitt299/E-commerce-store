import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-bold tracking-tight text-stone-900">E-Commerce</p>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Everyday essentials and more. Cash on delivery available across India.
          </p>
          <p className="mt-3 text-xs text-stone-400">Support: 9am – 9pm, all days</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li><Link className="hover:text-stone-900" to="/products">All products</Link></li>
            <li><Link className="hover:text-stone-900" to="/products?category=electronics">Electronics</Link></li>
            <li><Link className="hover:text-stone-900" to="/products?category=fashion">Fashion</Link></li>
            <li><Link className="hover:text-stone-900" to="/cart">Cart</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li><Link className="hover:text-stone-900" to="/orders">My orders</Link></li>
            <li><Link className="hover:text-stone-900" to="/login">Login</Link></li>
            <li><Link className="hover:text-stone-900" to="/register">Register</Link></li>
            <li><Link className="hover:text-stone-900" to="/forgot-password">Forgot password</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Policies</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li><span>7-day easy returns</span></li>
            <li><span>COD available</span></li>
            <li><span>Secure Razorpay payments</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-stone-400">
          <span>© 2026 E-Commerce. All rights reserved.</span>
          <span>Made in India</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
