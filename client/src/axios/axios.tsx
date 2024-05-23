import axios from "axios";

const baseURL = "https://aslah.online/api"; // Set your base URL here
const axiosInstance = axios.create({ baseURL });

// Add a request interceptor to include the JWT token in the headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token) {
      // Check if the token has expired
      const tokenExpiry = JSON.parse(atob(token.split(".")[1])).exp * 1000;
      if (tokenExpiry < Date.now()) {
        if (refreshToken) {
          try {
            const response = await axios.post(`${baseURL}/refresh-token`, {
              refreshToken,
            });
            const newToken = response.data.token;
            const newRefreshToken = response.data.refreshToken;
            if (newToken) {
              localStorage.setItem("token", newToken);
              localStorage.setItem("refreshToken", newRefreshToken);
            }
          } catch (error) {
            console.error("Error refreshing token:", error);
            return Promise.reject(error);
          }
        } else {
          console.error("No refresh token available");
          return Promise.reject("No refresh token available");
        }
      }

      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
