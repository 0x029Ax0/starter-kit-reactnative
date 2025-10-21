import { AxiosContext } from "@/lib/axios";
import { AxiosInstance } from "axios";
import { useContext } from "react";

export const useAxios = (): AxiosInstance => {
    return useContext(AxiosContext);
};