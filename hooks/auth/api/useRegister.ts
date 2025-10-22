import { useApiMutation } from '@/lib/http';

export type RegisterInput = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type RegisterResponse = {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    }
};

export const useRegister = (
    options?: Parameters<typeof useApiMutation<RegisterInput, RegisterResponse>>[2]
) => {
    return useApiMutation<RegisterInput, RegisterResponse>(
        ['auth', 'register'],
        { url: 'auth/register', method: 'POST' },
        options
    );
};