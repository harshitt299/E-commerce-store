import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateQty, removeItem } from "../services/cartService";

function Cart() {
  const [cart, setCart] = useState({ items: [], totalCartPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCart();
      setCart(res.cart || { items: [], totalCartPrice: 0 });
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleQty = async (productId, qty) => {
    if (qty < 1) return;
    try {
      const res = await updateQty(productId, qty);
      setCart(res.cart);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await removeItem(productId);
      setCart(res.cart);
    } catch {
      alert("Failed to remove item");
    }
  };

  if (loading)
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="h-6 w-40 animate-pulse rounded bg-stone-200" />
        <div className="mt-4 space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-stone-200" />
          ))}
        </div>
      </div>
    );
  if (error) return <p className="mx-auto max-w-7xl px-4 py-10 text-sm text-red-700">{error}</p>;

  if (!cart.items.length)
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-lg font-bold text-stone-900">Your cart is empty</p>
        <p className="mt-1 text-sm text-stone-500">Add something you like — it will show up here.</p>
        <Link to="/products" className="mt-4 inline-block rounded-md bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white">
          Browse products
        </Link>
      </div>
    );

  const delivery = cart.totalCartPrice >= 499 ? 0 : 49;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-xl font-bold tracking-tight text-stone-900">Cart ({cart.items.length})</h1>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {cart.items.map((it) => {
            const p = it.product;
            const pid = p?._id || it.product;
            return (
              <div key={pid} className="flex gap-4 rounded-lg border border-stone-200 bg-white p-3">
                <Link to={`/products/${p?._id}`} className="shrink-0">
                  <img src={p?.images?.[0]} alt={p?.name} className="h-20 w-20 rounded-md border border-stone-100 object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${p?._id}`} className="line-clamp-2 text-sm font-medium text-stone-900 hover:underline">
                    {p?.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-stone-500">{p?.brand}</p>
                  <p className="mt-1 text-sm font-bold text-stone-900">₹{Number(it.price).toLocaleString("en-IN")}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex items-center rounded-md border border-stone-300">
                      <button onClick={() => handleQty(pid, it.quantity - 1)} className="px-2.5 py-1 text-stone-600 hover:text-stone-900">−</button>
                      <span className="w-7 text-center text-sm font-semibold">{it.quantity}</span>
                      <button onClick={() => handleQty(pid, it.quantity + 1)} className="px-2.5 py-1 text-stone-600 hover:text-stone-900">+</button>
                    </span>
                    <button onClick={() => handleRemove(pid)} className="text-xs font-medium text-stone-500 hover:text-red-700">
                      Remove
                    </button>
                    <span className="ml-auto text-sm font-semibold text-stone-900">
                      ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-4 lg:sticky lg:top-24">
          <p className="text-sm font-bold text-stone-900">Price details</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <dt>Subtotal</dt>
              <dd>₹{Number(cart.totalCartPrice).toLocaleString("en-IN")}</dd>
            </div>
            <div className="flex justify-between text-stone-600">
              <dt>Delivery</dt>
              <dd className={delivery === 0 ? "font-semibold text-green-700" : ""}>
                {delivery === 0 ? "Free" : `₹${delivery}`}
              </dd>
            </div>
            <div className="flex justify-between border-t border-stone-100 pt-2 font-bold text-stone-900">
              <dt>Total</dt>
              <dd>₹{(cart.totalCartPrice + delivery).toLocaleString("en-IN")}</dd>
            </div>
          </dl>
          {delivery > 0 && (
            <p className="mt-2 text-xs text-stone-500">
              Add ₹{(499 - cart.totalCartPrice).toLocaleString("en-IN")} more for free delivery.
            </p>
          )}
          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 w-full rounded-md bg-stone-900 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Proceed to checkout
          </button>
          <p className="mt-2 text-center text-xs text-stone-400">COD available · 7-day returns</p>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
