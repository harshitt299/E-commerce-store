import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createOrder, verifyPayment } from "../services/orderService";

const inputCls = "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900";

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
      if (!key || key.includes("xxxx")) { reject(new Error("Add your Razorpay test key in frontend/.env (VITE_RAZORPAY_KEY_ID)")); return; }
      if (!window.Razorpay) { reject(new Error("Razorpay script not loaded")); return; }
      const rzp = new window.Razorpay({
        key,
        amount: razorpayOrder.amount,
        currency: "INR",
        order_id: razorpayOrder.id,
        name: "E-Commerce",
        description: "Order payment",
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
        modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
      });
      rzp.open();
    });
  };

  const handlePlace = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.street || !form.city || !form.pincode || !form.phone) {
      setError("Please fill all address fields"); return;
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
      setError(err.response?.data?.message || err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-xl font-bold tracking-tight text-stone-900">Checkout</h1>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handlePlace} className="space-y-5">
          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <p className="text-sm font-bold text-stone-900">1 · Delivery address</p>
            {error && <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-stone-600">Street address</label>
                <input name="street" placeholder="Flat, street, area" value={form.street} onChange={onChange} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-600">City</label>
                <input name="city" placeholder="City" value={form.city} onChange={onChange} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Pincode</label>
                  <input name="pincode" placeholder="6-digit" value={form.pincode} onChange={onChange} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-600">Phone</label>
                  <input name="phone" placeholder="10-digit" value={form.phone} onChange={onChange} className={inputCls} />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <p className="text-sm font-bold text-stone-900">2 · Payment method</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                ["COD", "Cash on delivery", "Pay in cash or UPI at your doorstep."],
                ["Online", "Pay online", "UPI, cards and netbanking via Razorpay."],
              ].map(([v, t, d]) => (
                <label
                  key={v}
                  className={`cursor-pointer rounded-md border p-3 ${method === v ? "border-stone-900 bg-stone-50" : "border-stone-200 hover:border-stone-400"}`}
                >
                  <span className="flex items-center gap-2">
                    <input type="radio" checked={method === v} onChange={() => setMethod(v)} />
                    <span className="text-sm font-semibold text-stone-900">{t}</span>
                  </span>
                  <span className="mt-1 block text-xs text-stone-500">{d}</span>
                </label>
              ))}
            </div>
          </section>

          <button
            disabled={placing}
            className="w-full rounded-md bg-stone-900 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50 sm:w-auto sm:px-8"
          >
            {placing ? "Placing order…" : method === "COD" ? "Place order · Pay on delivery" : "Continue to payment"}
          </button>
        </form>

        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-4 lg:sticky lg:top-24">
          <p className="text-sm font-bold text-stone-900">Your order</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li className="flex justify-between"><span>Delivery</span><span>3–5 days</span></li>
            <li className="flex justify-between"><span>Returns</span><span>7 days, free pickup</span></li>
            <li className="flex justify-between"><span>Payment</span><span>{method === "COD" ? "Cash on delivery" : "Razorpay secure"}</span></li>
          </ul>
          <Link to="/cart" className="mt-3 block text-center text-xs font-medium text-stone-600 underline underline-offset-4">
            Back to cart
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
