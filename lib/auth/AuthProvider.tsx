import { useApiMutation, useAxios } from "@/lib/http";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import {
    ChangePasswordInput,
    ChangePasswordResponse,
    DeleteAccountInput,
    DeleteAccountResponse,
    LoginCredentials,
    LoginResponse,
    RecoverAccountInput,
    RecoverAccountResponse,
    RefreshResponse,
    RegisterInput,
    RegisterResponse,
    ResetPasswordInput,
    ResetPasswordResponse,
    UpdateProfileInput,
    UpdateProfileResponse,
    User,
} from "./types";

export type AuthState = "loading" | "guest" | "authenticated";

export type AuthContextValue = {
    state: AuthState;
    user: User | null;
    accessToken: string | null;

    register: (input: RegisterInput) => Promise<RegisterResponse>;
    recoverAccount: (input: RecoverAccountInput) => Promise<RecoverAccountResponse>;
    resetPassword: (input: ResetPasswordInput) => Promise<ResetPasswordResponse>;
    login: (credentials: LoginCredentials) => Promise<LoginResponse>;
    changePassword: (input: ChangePasswordInput) => Promise<ChangePasswordResponse>;
    updateProfile: (input: UpdateProfileInput) => Promise<UpdateProfileResponse>;
    deleteAccount: (input: DeleteAccountInput) => Promise<DeleteAccountResponse>;
    logout: () => Promise<void>;
    refresh: () => Promise<RefreshResponse>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const axios = useAxios();
    const router = useRouter();

    // State
    const [state, setState] = useState<AuthState>("loading");
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Secure storage for the accessToken
    const accessTokenStoreKey = "starter-kit-access-token";
    const saveAccessToken = async (token: string) => {
        if (Platform.OS === "web") {
            localStorage.setItem(accessTokenStoreKey, token);
        } else {
            await SecureStore.setItemAsync(accessTokenStoreKey, token);
        }
    };
    const getAccessToken = async (): Promise<string | null> => {
        console.debug("getAccessToken");
        console.debug("- platform os: ", Platform.OS);
        if (Platform.OS === "web") {
            const result = localStorage.getItem(accessTokenStoreKey);
            console.debug("- web token: ", result);
            if (result) return result;
            return null;
        } else {
            const result = await SecureStore.getItemAsync(accessTokenStoreKey);
            console.debug("- android token: ", result);
            if (result) return result;
            return null;
        }
    };

    // Register a new user
    const registerMutation = useApiMutation<RegisterInput, RegisterResponse>(
        ['auth', 'register'],
        { url: 'auth/register', method: 'POST' },
    );
    const register = async (input: RegisterInput) => {
        try {
            const response = await registerMutation.mutateAsync(input);
            await saveAccessToken(response.token);
            setAccessToken(response.token);
            setUser(response.user);
            setState("authenticated");
            return response;
        } catch (error) {
            console.debug("register error:", error);
            return {} as RegisterResponse;
        }
    };

    // Recover account
    const recoverAccountMutation = useApiMutation<RecoverAccountInput, RecoverAccountResponse>(
        ['auth', 'recover-account'],
        { url: 'auth/recover-account', method: 'POST' },
    );
    const recoverAccount = useCallback(async (input: RecoverAccountInput) => {
        return await recoverAccountMutation.mutateAsync(input);
    }, [recoverAccountMutation]);

    // Reset password
    const resetPasswordMutation = useApiMutation<ResetPasswordInput, ResetPasswordResponse>(
        ['auth', 'reset-password'],
        { url: 'auth/reset-password', method: 'POST' },
    );
    const resetPassword = useCallback(async (input: ResetPasswordInput) => {
        return await resetPasswordMutation.mutateAsync(input);
    }, [resetPasswordMutation]);
    
    // Login the user
    const loginMutation = useApiMutation<LoginCredentials, LoginResponse>(
        ['auth', 'login'],
        { url: 'auth/login', method: 'POST' },
    );
    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await loginMutation.mutateAsync(credentials);
            await saveAccessToken(response.token);
            setUser(response.user);
            setAccessToken(response.token);
            setState("authenticated");
            return response;
        } catch (error) {
            console.debug("login error:", error);
            return {} as LoginResponse;
        }
    };
    
    // Change password
    const changePasswordMutation = useApiMutation<ChangePasswordInput, UpdateProfileResponse>(
        ['auth', 'change-password'],
        {
            url: 'auth/change-password',
            method: 'POST',
        },
    );
    const changePassword = useCallback(async (input: ChangePasswordInput) => {
        return await changePasswordMutation.mutateAsync(input);
    }, [changePasswordMutation]);
    
    // Update profile
    const updateProfileMutation = useApiMutation<UpdateProfileInput, UpdateProfileResponse>(
        ['auth', 'update-profile'],
        {
            url: 'auth/update-profile',
            method: 'POST',
        },
    );
    const updateProfile = useCallback(async (input: UpdateProfileInput) => {
        const response = await updateProfileMutation.mutateAsync(input);
        setUser(response.user);
        return response;
    }, [updateProfileMutation]);

    // Delete the account of the user
    const deleteAccountMutation = useApiMutation<DeleteAccountInput, DeleteAccountResponse>(
        ['auth', 'delete-account'],
        {
            url: 'auth/delete-account',
            method: 'POST',
        },
    );
    const deleteAccount = useCallback(async (input: DeleteAccountInput) => {
        const response = await deleteAccountMutation.mutateAsync(input);
        setAccessToken(null);
        setUser(null);
        setState('guest');
        return response;
    }, [deleteAccountMutation]);

    // Logout the user
    const logoutMutation = useApiMutation<void, void>(
        ['auth', 'logout'],
        {
            url: 'auth/logout',
            method: 'POST',
        },
    );
    const logout = useCallback(async () => {
        await logoutMutation.mutateAsync();

        setAccessToken(null);
        setUser(null);
        setState('guest');
    }, [logoutMutation]);

    // Refresh
    const refreshMutation = useApiMutation<void, RefreshResponse>(
        ['auth', 'refresh'],
        {
            url: 'auth/refresh',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+accessToken,
            },
        },
    );
    const refresh = useCallback(async () => {
        const response = await refreshMutation.mutateAsync();
        console.debug("refresh response: ", response);
        setState("authenticated");
        setUser(response.user);
        return response;
    }, [refreshMutation]);

    // Axios Interceptors
    useEffect(() => {
        if (accessToken) {
            console.debug("access token changed, setting axios interceptors", accessToken);
            
            // Attach token to requests
            const requestInterceptor = axios.interceptors.request.use(config => {
                if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
                console.debug("request interceptor", config.headers);
                return config;
            });
    
            // Redirect on 401
            // TODO: send the user a notification
            const responseInterceptor = axios.interceptors.response.use(
                res => res,
                async err => {
                    console.debug("response interceptor");
                    console.debug("- error:", err);
                    return Promise.reject(err);
                }
            );
    
            // Cleanup the interceptors
            return () => {
                axios.interceptors.request.eject(requestInterceptor);
                axios.interceptors.response.eject(responseInterceptor);
            };
        }
    }, [accessToken]);

    // On mount
    useEffect(() => {
        // Retrieve the access token from storage
        getAccessToken().then((token) => {
            if (token) {
                // Persist the access token in state
                setAccessToken(token);

                // Attempt to refresh the logged in user
                refresh()
                    .then(() => {
                        // Redirect user to the dashboard
                        router.replace('/dashboard');
                    })
                    .catch((error) => {
                        console.debug("refresh error:", error);
                        // Reset the access token in storage as it's invalid
                        setAccessToken(null);
                        // Redirect user to login
                        router.replace('/login');
                    })
            } else {
                router.replace("/login");
            }
        })
        .catch((error) => {
            console.debug("get access token error:", error);
        });
    }, []);

    // Compose the object we're making available through the provider
    const value = useMemo(() => ({
        state, 
        user, 
        accessToken, 
        register,
        recoverAccount,
        resetPassword,
        login,
        changePassword,
        updateProfile,
        deleteAccount,
        logout,
        refresh,
    }), [
        state, 
        user, 
        accessToken, 
        register, 
        resetPassword, 
        login, 
        changePassword, 
        updateProfile, 
        deleteAccount,
        logout, 
        refresh,
    ]);

    // Return the provider component we can load in the app's root component
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}