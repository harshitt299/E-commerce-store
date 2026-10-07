import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, cancelOrder } from "../services/orderService";

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
    if (!confirm("Cancel karna hai?")) return;
    await cancelOrder(id);
    load();
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Mere Orders</h2>
      {orders.length === 0 && <p>Koi order nahi. <Link to="/products">Shop karo</Link></p>}
      {orders.map((o) => (
        <div key={o._id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 8 }}>
          <Link to={`/orders/${o._id}`}>{o._id}</Link>
          <p>₹ {o.totalAmount} • {o.orderStatus} • {o.isPaid ? "Paid" : "Unpaid"}</p>
          {o.orderStatus === "Processing" && <button onClick={() => handleCancel(o._id)}>Cancel</button>}
        </div>
      ))}
      <div>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        {" "}{page}/{totalPages}{" "}
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}

export default Orders;
