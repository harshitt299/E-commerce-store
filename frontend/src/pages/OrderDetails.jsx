import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMyOrderById } from "../services/orderService";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrderById(id)
      .then((r) => setOrder(r.order))
      .catch((e) => setError(e.response?.data?.message || "Not found"));
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!order) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Order {order._id}</h2>
      <p>Status: {order.orderStatus} • {order.isPaid ? "Paid" : "Unpaid"} • {order.paymentMethod}</p>
      <p>{order.shippingAddress?.street}, {order.shippingAddress?.city} {order.shippingAddress?.pincode} {order.shippingAddress?.phone}</p>
      {order.orderItems.map((it, i) => (
        <p key={i}>{it.name} x {it.quantity} = ₹ {it.price * it.quantity}</p>
      ))}
      <h3>Total ₹ {order.totalAmount}</h3>
    </div>
  );
}

export default OrderDetails;
