import { api } from "./api";

const getCart = async () => {
  const res = await api.get("/cart/");
  return res.data;
};

const addToCart = async (productId, quantity = 1) => {
  const res = await api.post("/cart/", { productId, quantity });
  return res.data;
};

const updateQty = async (productId, quantity) => {
  const res = await api.patch("/cart/update", { productId, quantity });
  return res.data;
};

const removeItem = async (productId) => {
  const res = await api.delete(`/cart/remove/${productId}`);
  return res.data;
};

export { getCart, addToCart, updateQty, removeItem };
