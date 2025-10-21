import { useAxios } from "@/lib/axios";
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import type { AxiosError, AxiosInstance } from 'axios';

export type LoginCredentials = {
    email: string;
    password: string
};

export type LoginResponse = {
    token: string;
    user: { id: string; email: string; name?: string };
};

export type ApiErrorResponse = {
    message?: string;
    statusCode?: number;
    errors?: Record<string, string[] | string>;
    [key: string]: unknown;
};

export const getApiErrorMessage = (
    error: AxiosError<ApiErrorResponse>
): string => {
    if (!error) return 'Unknown error';
    const fallback = error.message || 'Request failed';
    const data = error.response?.data;
    if (!data) return fallback;

    if (typeof data.message === 'string' && data.message.trim().length > 0) {
        return data.message;
    }
    if (data.errors && typeof data.errors === 'object') {
        const firstKey = Object.keys(data.errors)[0];
        const first = firstKey ? (data.errors as any)[firstKey] : undefined;
        if (Array.isArray(first) && first.length > 0) return String(first[0]);
        if (typeof first === 'string') return first;
    }
    return fallback;
};

const loginRequest = async (
    axios: AxiosInstance, 
    credentials: LoginCredentials, 
    config?: { headers?: Record<string, string> },
) => {
    const endpoint = "auth/login";
    const headers = { headers: { 'Content-Type': 'application/json', ...(config?.headers ?? {}) }};
    const { data } = await axios.post<LoginResponse>(endpoint, credentials, headers);
    return data;
};

export const useLoginMutation = (
    options?: UseMutationOptions<LoginResponse, AxiosError<ApiErrorResponse>, LoginCredentials>
): UseMutationResult<LoginResponse, AxiosError<ApiErrorResponse>, LoginCredentials> => {
    const axios = useAxios();

    return useMutation<LoginResponse, AxiosError<ApiErrorResponse>, LoginCredentials>({
        mutationKey: ['auth', 'login'],
        mutationFn: (credentials) => loginRequest(axios, credentials),
        ...options,
    });
};

export const useLogin = () => {
    const mutation = useLoginMutation();
    
    const friendlyError = (mutation.error && getApiErrorMessage(mutation.error)) || undefined;

    const login = async (credentials: LoginCredentials): Promise<LoginResponse | undefined> => {
        try {
            const data = await mutation.mutateAsync(credentials);
            return data;
        } catch (e) {
            return undefined;
        }
    };
        
    const loginAsync = (credentials: LoginCredentials) => mutation.mutateAsync(credentials);

    return {
        ...mutation,
        login,
        loginAsync,
        isLoading: mutation.isPending,
        errorMessage: friendlyError,
    } as const;
};