import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const baseURL = "https://delicious-rest-backend.onrender.com/api";
// http://192.168.29.186:2000/api
// https://delicious-rest-backend.onrender.com/api

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Safe token fetch with fallback
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token || "";
  } catch (error) {
    console.error("Error reading token from AsyncStorage:", error);
    return "";
  }
};

// Axios interceptor with full try-catch
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("Interceptor error:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
