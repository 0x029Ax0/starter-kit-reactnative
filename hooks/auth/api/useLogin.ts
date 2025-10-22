import { useApiMutation } from '@/lib/http';

export type LoginCredentials = {
    email: string;
    password: string
};

export type LoginResponse = {
    token: string;
    user: {
        id: string;
        email: string;
        name?: string
    };
};

export const useResetPassword = (
    options?: Parameters<typeof useApiMutation<LoginCredentials, LoginResponse>>[2]
) => {
    return useApiMutation<LoginCredentials, LoginResponse>(
        ['auth', 'reset-password'],
        { url: 'auth/reset-password', method: 'POST' },
        options
    );
};