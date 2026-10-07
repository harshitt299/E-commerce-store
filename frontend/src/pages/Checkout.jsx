import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, verifyPayment } from "../services/orderService";

function Checkout() {
  const [form, setForm] = useState({ street: "", city: "", pincode: "", phone: "" });
  const [method, setMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openRazorpay = (razorpayOrder, dbOrderId) => {
    return new Promise((resolve, reject) => {
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) { reject(new Error("VITE_RAZORPAY_KEY_ID .env me set karo")); return; }
      if (!window.Razorpay) { reject(new Error("Razorpay script load nahi hui")); return; }
      const rzp = new window.Razorpay({
        key,
        amount: razorpayOrder.amount,
        currency: "INR",
        order_id: razorpayOrder.id,
        name: "E-Commerce",
        handler: async (resp) => {
          try {
            await verifyPayment({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              dbOrderId,
            });
            resolve();
          } catch (e) { reject(e); }
        },
        modal: { ondismiss: () => reject(new Error("Payment cancel kiya")) },
      });
      rzp.open();
    });
  };

  const handlePlace = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.street || !form.city || !form.pincode || !form.phone) {
      setError("Saare address field bharo"); return;
    }
    setPlacing(true);
    try {
      const res = await createOrder(form, method);
      if (method === "COD") {
        navigate(`/orders/${res.order._id}`);
      } else {
        await openRazorpay(res.razorpayOrder, res.orderId);
        navigate(`/orders/${res.orderId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Order fail");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <form onSubmit={handlePlace} style={{ maxWidth: 480, margin: "20px auto", display: "grid", gap: 10 }}>
      <h2>Checkout</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input name="street" placeholder="Street" value={form.street} onChange={onChange} />
      <input name="city" placeholder="City" value={form.city} onChange={onChange} />
      <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={onChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
      <label><input type="radio" checked={method==="COD"} onChange={()=>setMethod("COD")} /> COD</label>
      <label><input type="radio" checked={method==="Online"} onChange={()=>setMethod("Online")} /> Online</label>
      <button disabled={placing}>{placing ? "Placing..." : `Place order (${method})`}</button>
    </form>
  );
}
export default Checkout;
