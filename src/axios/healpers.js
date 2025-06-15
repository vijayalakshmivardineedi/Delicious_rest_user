import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const baseURL = "http://192.168.1.13:2000/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const Api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthToken = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? token : '';
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    console.log("token", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // ✅ Fixed here
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { Api };
