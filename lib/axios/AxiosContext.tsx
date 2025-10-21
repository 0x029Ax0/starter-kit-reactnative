import type { AxiosInstance } from 'axios';
import { createContext, ReactNode, useContext } from 'react';
import { http } from './AxiosInstance';

type AxiosProviderProps = {
    children: ReactNode;
    instance?: AxiosInstance;
};

export const AxiosContext = createContext<AxiosInstance>(http);

export const AxiosProvider = ({ children, instance }: AxiosProviderProps) => {
    return (
        <AxiosContext.Provider value={ instance ?? http }>
            { children }
        </AxiosContext.Provider>
    );
};

export const useAxios = (): AxiosInstance => {
    return useContext(AxiosContext);
};