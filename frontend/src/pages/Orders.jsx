import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, cancelOrder } from "../services/orderService";

function statusPill(order) {
  const base = "rounded-full px-2 py-0.5 text-[11px] font-semibold";
  if (order.orderStatus === "Cancelled") return `${base} bg-red-100 text-red-800`;
  if (order.orderStatus === "Delivered") return `${base} bg-green-100 text-green-800`;
  if (order.orderStatus === "Shipped") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-stone-200 text-stone-700`;
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMyOrders(page, 10);
      setOrders(res.myOrders || []);
      setTotalPages(res.totalPages || 1);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    await cancelOrder(id);
    load();
  };

  if (loading)
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="h-6 w-40 animate-pulse rounded bg-stone-200" />
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-stone-200" />
          ))}
        </div>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-xl font-bold tracking-tight text-stone-900">My orders</h1>
      {orders.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="font-medium text-stone-900">No orders yet</p>
          <p className="mt-1 text-sm text-stone-500">Your orders will show up here after checkout.</p>
          <Link to="/products" className="mt-4 inline-block rounded-md bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="flex flex-wrap items-center gap-3 rounded-lg border border-stone-200 bg-white p-4">
              <div className="min-w-0 flex-1">
                <Link to={`/orders/${o._id}`} className="truncate font-mono text-xs text-stone-500 hover:text-stone-900 hover:underline">
                  #{o._id}
                </Link>
                <p className="mt-1 text-sm font-bold text-stone-900">₹{Number(o.totalAmount).toLocaleString("en-IN")} · {o.orderItems?.length ?? 0} items</p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {o.paymentMethod} · {o.isPaid ? "Paid" : "Unpaid"}
                </p>
              </div>
              <span className={statusPill(o)}>{o.orderStatus}</span>
              <Link to={`/orders/${o._id}`} className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium hover:border-stone-900">
                View
              </Link>
              {o.orderStatus === "Processing" && (
                <button onClick={() => handleCancel(o._id)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50">
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm disabled:opacity-40">
            Prev
          </button>
          <span className="text-sm text-stone-500">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm disabled:opacity-40">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Orders;
