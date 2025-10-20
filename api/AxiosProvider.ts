import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import type { AxiosError, AxiosInstance } from "axios";
import { createAxiosInstance } from "./axiosInstance";

type AxiosProviderProps = {
    baseURL: string;
    children: ReactNode;

    /** Optional: return a bearer token before each request. */
    getAuthToken?: () => Promise<string | null>;

    /** Optional: handle auth errors (e.g., navigate to login). */
    onAuthError?: (error: AxiosError) => void;

    headers?: Record<string, string>;
    timeout?: number;
};

const AxiosContext = createContext<AxiosInstance | null>(null);

export function AxiosProvider({
    baseURL,
    children,
    getAuthToken,
    onAuthError,
    headers,
    timeout,
}: AxiosProviderProps) {
    const axios = useMemo(
        () => createAxiosInstance({ baseURL, headers, timeout }),
        [baseURL, headers, timeout]
    );

    const getAuthTokenRef = useRef(getAuthToken);
    const onAuthErrorRef = useRef(onAuthError);
    useEffect(() => {
        getAuthTokenRef.current = getAuthToken;
        onAuthErrorRef.current = onAuthError;
    }, [getAuthToken, onAuthError]);

    useEffect(() => {
        const reqId = axios.interceptors.request.use(async (config) => {
            const token = await getAuthTokenRef.current?.();
            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
            return config;
        });

        const resId = axios.interceptors.response.use(
            (res) => res,
            async (error) => {
                // Simple pass-through with optional handler.
                if (error?.response?.status === 401) {
                    onAuthErrorRef.current?.(error);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(reqId);
            axios.interceptors.response.eject(resId);
        };
    }, [axios]);

    return <AxiosContext.Provider value={ axios }> { children } </AxiosContext.Provider>;
}

export function useAxios(): AxiosInstance {
    const ctx = useContext(AxiosContext);
    if (!ctx) {
        throw new Error("useAxios must be used within an AxiosProvider");
    }
    return ctx;
}
