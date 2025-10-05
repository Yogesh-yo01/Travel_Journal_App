import { BASE_URL } from "./Endpoint";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Function to retrieve the access token
const getAccessToken = async () => {
    try {
        const token = await AsyncStorage.getItem("accessToken");
        return token;
    } catch (error) {
        console.log("Error fetching access token from AsyncStorage:", error);
        return null;
    }
};

// Function to retrieve the refresh token
const getRefreshToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        return refreshToken;
    } catch (error) {
        console.log("Error fetching refresh token from AsyncStorage:", error);
        return null;
    }
};

// Function to save new tokens to AsyncStorage
const saveTokens = async (accessToken, refreshToken, accessTokenExpires) => {
    try {
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        await AsyncStorage.setItem("accessTokenExpiry", accessTokenExpires);
    } catch (error) {
        console.log("Error saving tokens to AsyncStorage:", error);
    }
};

// Function to check if the token has expired
const isTokenExpired = (expiresAt) => {
    const currentTime = new Date();
    const tokenExpirationTime = new Date(expiresAt);
    return tokenExpirationTime < currentTime;
};

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }
    try {
        const response = await axios.post(`${BASE_URL}/auth/refresh-tokens`, {
            refreshToken,
        });

        // Save the new tokens and expiration time to AsyncStorage
        const { access, refresh } = response.data;
        await saveTokens(access.token, refresh.token, access.expires);

        return access.token;
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return null;
    }
};

// Initialize axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add interceptor to handle token expiration and refresh
axiosInstance.interceptors.request.use(
    async (config) => {
        // Get the current access token and expiration time
        const token = await getAccessToken();
        const expiresAt = await AsyncStorage.getItem("accessTokenExpiry");

        // If there's a token and it has expired, refresh it
        if (token && expiresAt && isTokenExpired(expiresAt)) {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                // Set the new token in the request header
                config.headers.Authorization = `Bearer ${newAccessToken}`;
            }
        } else if (token) {
            // If the token has not expired, add it to the headers
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;