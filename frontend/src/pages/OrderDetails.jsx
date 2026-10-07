import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMyOrderById } from "../services/orderService";

const STEPS = ["Processing", "Shipped", "Delivered"];

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrderById(id)
      .then((r) => setOrder(r.order))
      .catch((e) => setError(e.response?.data?.message || "Not found"));
  }, [id]);

  if (error) return <p className="mx-auto max-w-7xl px-4 py-10 text-sm text-red-700">{error}</p>;
  if (!order) return <p className="mx-auto max-w-7xl px-4 py-10 text-sm text-stone-500">Loading order…</p>;

  const stepIdx = order.orderStatus === "Cancelled" ? -1 : STEPS.indexOf(order.orderStatus);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <p className="text-xs text-stone-500">
        <Link to="/orders" className="hover:underline">My orders</Link> /{" "}
        <span className="font-mono">#{order._id}</span>
      </p>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-stone-900">Order #{String(order._id).slice(-8)}</h1>
              <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[11px] font-semibold text-stone-700">
                {order.orderStatus}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${order.isPaid ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                {order.isPaid ? "Paid" : "Unpaid"} · {order.paymentMethod}
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>

            {stepIdx >= 0 && (
              <ol className="mt-4 flex items-center">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex flex-1 items-center last:flex-none">
                    <span className="flex flex-col items-center">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${i <= stepIdx ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500"}`}>
                        {i + 1}
                      </span>
                      <span className="mt-1 text-[11px] text-stone-600">{s}</span>
                    </span>
                    {i < STEPS.length - 1 && (
                      <span className={`mx-2 h-0.5 w-full ${i < stepIdx ? "bg-stone-900" : "bg-stone-200"}`} />
                    )}
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <p className="text-sm font-bold text-stone-900">Items ({order.orderItems.length})</p>
            <ul className="mt-3 divide-y divide-stone-100">
              {order.orderItems.map((it, i) => (
                <li key={i} className="flex items-center gap-3 py-3">
                  {it.image && <img src={it.image} alt={it.name} className="h-12 w-12 rounded-md border border-stone-100 object-cover" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-stone-900">{it.name}</p>
                    <p className="text-xs text-stone-500">Qty {it.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-stone-900">₹{(it.price * it.quantity).toLocaleString("en-IN")}</p>
                </li>
              ))}
            </ul>
            <p className="mt-2 border-t border-stone-100 pt-3 text-right text-base font-bold text-stone-900">
              Total ₹{Number(order.totalAmount).toLocaleString("en-IN")}
            </p>
          </section>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <p className="text-sm font-bold text-stone-900">Delivery address</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city} — {order.shippingAddress?.pincode}<br />
              Phone: {order.shippingAddress?.phone}
            </p>
          </section>
          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <p className="text-sm font-bold text-stone-900">Need help?</p>
            <p className="mt-1 text-xs leading-5 text-stone-500">7-day returns on most items. Contact support with your order id.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default OrderDetails;
