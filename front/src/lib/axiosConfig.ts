"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { APIError } from "./errors";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  adapter: "fetch",
});

// Interceptor automatically adds Authorization header if token exists
axiosInstance.interceptors.request.use(async (config) => {
  const apiKey = (await cookies()).get(process.env.AUTH_TOKEN_NAME!);
  if (apiKey) {
    config.headers.set("Authorization", apiKey.value);
  }
  return config;
});

// axiosInstance.interceptors.request.use(
//   (request) => {
//     console.log("axios: ", request.method, request.url);
//     // Important: you must return the request config object
//     return request;
//   },
//   (error) => {
//     console.error("Request Error:", error);
//     return Promise.reject(error);
//   },
// );

// Interceptor to handle error responses and extract message
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract message from response data if available
    const message = error.response?.data?.message;

    if (typeof message === "string") {
      throw new APIError(message);
    }

    // Fallback to original error (network errors, timeouts, etc.)
    throw error;
  },
);

export default axiosInstance;
