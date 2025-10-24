import { AxiosContext } from "@/lib/http";
import { AxiosInstance } from "axios";
import { useContext } from "react";

export const useAxios = (): AxiosInstance => {
    return useContext(AxiosContext);
};