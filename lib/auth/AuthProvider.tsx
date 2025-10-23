import { useAxios } from "@/lib/http";
import * as SecureStore from "expo-secure-store";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { User } from "./types";
import { LoginCredentials, useLogin, useLogout } from "@/hooks/auth";

export type AuthState = "loading" | "guest" | "authenticated";

export type AuthContextValue = {
    state: AuthState;
    user: User | null;
    accessToken: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {

    const [state, setState] = useState<AuthState>("loading");
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const axios = useAxios();

    const REFRESH_KEY = "refresh-token";

    useEffect(() => {

        // Attach token to requests
        const requestInterceptor = axios.interceptors.request.use(config => {
            if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
            return config;
        });

        // Auto refresh or redirect on 401
        const responseInterceptor = axios.interceptors.response.use(
            res => res,
            async err => {
                await logout();
                return Promise.reject(err);
                // const original = err.config;
                // if (err.response?.status === 401 && !original._retry) {
                //     original._retry = true;
                //     const ok = await tryRefresh();
                //     if (ok) return api(original);
                //     await hardLogout();
                // }
                // return Promise.reject(err);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };

    }, [accessToken]);

    const tryRefresh = async (): Promise<boolean> => {
        const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
        if (!refresh) return false;
        try {
            const { data } = await axios.post('auth/refresh', { refreshToken: refresh });
            setAccessToken(data.accessToken);
            setUser(data.user); // ideally backend returns lightweight user
            return true;
        } catch {
            return false;
        }
    };

    const login = useCallback(async (credentials: LoginCredentials) => {

    }, []);

    const logout = useCallback(async () => {
        setAccessToken(null);
        setUser(null);
        setState('guest');
    }, []);

    // Bootstrap on app start
    // useEffect(() => {
    //     (async () => {
    //         const ok = await tryRefresh();
    //         setState(ok ? 'authenticated' : 'guest');
    //     })();
    // }, []);

    const value = useMemo(() => ({ user, accessToken, state, login, logout }), [user, accessToken, state, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}