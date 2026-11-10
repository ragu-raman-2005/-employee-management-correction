
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8081/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to every API request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ems_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle API response errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("Backend server is not responding.");
    } else {
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
