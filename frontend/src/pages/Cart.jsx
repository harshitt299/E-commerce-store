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
      setError(err.response?.data?.message || "Cart load nahi hua");
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
      alert(err.response?.data?.message || "Qty update fail");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await removeItem(productId);
      setCart(res.cart);
    } catch (err) {
      alert("Remove fail");
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!cart.items.length) return <p>Cart khali hai. <Link to="/products">Products dekho</Link></p>;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2>Cart ({cart.items.length})</h2>
      {cart.items.map((it) => {
        const p = it.product;
        const pid = p?._id || it.product;
        return (
          <div key={pid} style={{ display: "flex", gap: 12, border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
            <img src={p?.images?.[0]} alt={p?.name} style={{ width: 80, height: 80, objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <Link to={`/products/${p?._id}`}>{p?.name}</Link>
              <p>₹ {it.price} x {it.quantity} = ₹ {it.price * it.quantity}</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => handleQty(pid, it.quantity - 1)}>-</button>
                <span>{it.quantity}</span>
                <button onClick={() => handleQty(pid, it.quantity + 1)}>+</button>
                <button onClick={() => handleRemove(pid)}>Remove</button>
              </div>
            </div>
          </div>
        );
      })}
      <h3>Total: ₹ {cart.totalCartPrice}</h3>
      <button onClick={() => navigate("/checkout")}>Checkout karo</button>
    </div>
  );
}

export default Cart;
