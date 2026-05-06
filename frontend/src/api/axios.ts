import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// redirect to signin on 401 — but skip if already on auth pages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage =
      window.location.pathname === "/signin" ||
      window.location.pathname === "/signup";

    if (error.response?.status === 401 && !isAuthPage) {
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  },
);

export default api;
