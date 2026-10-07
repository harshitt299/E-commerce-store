import { api } from "./api";

// Register
const registerUser = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

const loginUser = async (userData) => {
  const response = await api.post("/users/login", userData);
  return response.data;
};

const logoutUser = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};

const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post("/users/forgot-password", { email });
  return response.data;
};

const resetPassword = async (token, newPassword) => {
  const response = await api.post(`/users/reset-password/${token}`, { newPassword });
  return response.data;
};

export { registerUser, loginUser, logoutUser, getCurrentUser, forgotPassword, resetPassword };
