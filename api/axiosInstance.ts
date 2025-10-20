import axios, { AxiosInstance } from "axios";

export type CreateAxiosInstanceOptions = {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
};

export function createAxiosInstance({
    baseURL,
    timeout = 15000,
    headers = {},
}: CreateAxiosInstanceOptions): AxiosInstance {
    return axios.create({
        baseURL,
        timeout,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...headers,
        },
    });
}
