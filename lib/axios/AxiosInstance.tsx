import axios, { AxiosHeaders, AxiosInstance } from 'axios';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
    // You can also set a default header here if you want:
    if (token) {
        http.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete http.defaults.headers.common.Authorization;
    }
}

export const http: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost/api",
    timeout: 15_000, // 15s
    // withCredentials: true, // enable if you use cookies
});

// Request interceptor (auth, tracing, etc.)
http.interceptors.request.use((config) => {
    if (authToken) {
        // Normalize to AxiosHeaders so TS is happy
        const headers = (config.headers = AxiosHeaders.from(config.headers));

        // Only set if not already provided
        if (!headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${authToken}`);
        }
    }
    return config;
});

// Response interceptor (normalize errors, refresh logic, etc.)
http.interceptors.response.use(
    (res) => res,
    async (error) => {
        // Example place to handle 401 token refresh, logging, etc.
        // For now, just rethrow a clean error object.
        const status = error.response?.status;
        const message =
            error.response?.data?.message ??
            error.message ??
            'Network error';
        return Promise.reject({ status, message, raw: error });
    }
);
