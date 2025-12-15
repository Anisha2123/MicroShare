import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const register = (data: { name: string; email: string; password: string }) =>
  axios.post(`${API_URL}/auth/register`, data);

export const login = (data: { email: string; password: string }) =>
  axios.post(`${API_URL}/auth/login`, data);

export const getTips = () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API_URL}/tip/tips`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createTip = (data: FormData) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/tip`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};


/* ✅ CREATE AXIOS INSTANCE (ONLY ADDITION) */
const API = axios.create({
  baseURL: API_URL,
});

/* ✅ INTERCEPTOR FIX */
API.interceptors.request.use(req => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

/* DASHBOARD */
export const fetchDashboard = () => API.get("/dashboard");