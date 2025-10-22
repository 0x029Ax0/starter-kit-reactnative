import { useAxios } from "@/lib/http";
import * as SecureStore from "expo-secure-store";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import type { User } from "./types";

export type AuthState = "loading" | "guest" | "authenticated";

export type AuthContext = {
    state: AuthState;
    user: User | null;
    logout: () => Promise<void>;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [state, setState] = useState<AuthState>("loading");
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const axios = useAxios();

    const REFRESH_KEY = "refresh-token";

    // Attach token to requests
    axios.interceptors.request.use(config => {
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    });

    // Auto refresh or redirect on 401
    axios.interceptors.response.use(
        res => res,
        async err => {
            await hardLogout();
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

    const hardLogout = async () => {
        setAccessToken(null);
        setUser(null);
        setState('guest');
    };


    // Bootstrap on app start
    useEffect(() => {
        (async () => {
            const ok = await tryRefresh();
            setState(ok ? 'authenticated' : 'guest');
        })();
    }, []);

};

export const useAuth = () => {
    const context = useContext(AuthContext);
}