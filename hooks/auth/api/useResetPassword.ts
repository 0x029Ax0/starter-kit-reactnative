import { useApiMutation } from '@/lib/http';

export type ResetPasswordInput = {
    email: string
};

export type ResetPasswordResponse = {
    status: boolean
};

export const useResetPassword = (
    options?: Parameters<typeof useApiMutation<ResetPasswordInput, ResetPasswordResponse>>[2]
) => {
    return useApiMutation<ResetPasswordInput, ResetPasswordResponse>(
        ['auth', 'reset-password'],
        { url: 'auth/reset-password', method: 'POST' },
        options
    );
};