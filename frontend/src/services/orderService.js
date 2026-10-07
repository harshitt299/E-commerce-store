import { api } from "./api";

const createOrder = async (shippingAddress, paymentMethod) => {
  const res = await api.post("/orders/create", { shippingAddress, paymentMethod });
  return res.data; // COD: {order}, Online: {razorpayOrder, orderId}
};
const verifyPayment = async (payload) => {
  const res = await api.post("/orders/verify", payload);
  return res.data;
};
const getMyOrders = async (page = 1, limit = 10) => {
  const res = await api.get("/orders/myorders", { params: { page, limit } });
  return res.data;
};
const getMyOrderById = async (id) => {
  const res = await api.get(`/orders/myorder/${id}`);
  return res.data;
};
const cancelOrder = async (id) => {
  const res = await api.patch(`/orders/myorder/${id}/cancel`);
  return res.data;
};
export { createOrder, verifyPayment, getMyOrders, getMyOrderById, cancelOrder };