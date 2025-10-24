// lib/react-query-api.ts
import { useAxios, type ApiErrorResponse } from '@/lib/http';
import { QueryKey, useMutation, UseMutationOptions, UseMutationResult, useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AxiosError, Method } from 'axios';

/**
 * Mutation query helper
 */

type RequestConfig = {
    url: string;
    method?: Method; // 'POST' | 'PUT' | 'PATCH' | 'DELETE' | ...
    headers?: Record<string, string>;
};

export function useApiMutation<TInput, TOutput>(
    key: QueryKey,
    config: RequestConfig,
    options?: UseMutationOptions<TOutput, AxiosError<ApiErrorResponse>, TInput>
): UseMutationResult<TOutput, AxiosError<ApiErrorResponse>, TInput> {
    const axios = useAxios();

    return useMutation<TOutput, AxiosError<ApiErrorResponse>, TInput>({
        mutationKey: key,
        mutationFn: async (input: TInput) => {
            const { data } = await axios.request<TOutput>({
                url: config.url,
                method: config.method ?? 'POST',
                data: input,
                headers: { 'Content-Type': 'application/json', ...config.headers },
            });
            return data;
        },
        ...options,
    });
}

/**
 * Generic query helper
 */

type QueryRequestConfig<TParams> = RequestConfig & { params?: (p: TParams) => Record<string, any> };

export function useApiQuery<TParams, TOutput>(
    key: (params: TParams) => QueryKey,
    config: QueryRequestConfig<TParams>,
    params: TParams,
    options?: UseQueryOptions<TOutput, AxiosError<ApiErrorResponse>, TOutput>
): UseQueryResult<TOutput, AxiosError<ApiErrorResponse>> {
    const axios = useAxios();
    const k = key(params);

    return useQuery<TOutput, AxiosError<ApiErrorResponse>>({
        queryKey: k,
        queryFn: async () => {
            const { data } = await axios.request<TOutput>({
                url: config.url,
                method: config.method ?? 'GET',
                params: config.params?.(params),
                headers: { ...config.headers },
            });
            return data;
        },
        ...options,
    });
}
