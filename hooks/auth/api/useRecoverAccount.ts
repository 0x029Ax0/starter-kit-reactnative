import { useApiMutation } from '@/lib/http';

export type RecoverAccountInput = {
    email: string;
};

export type RecoverAccountResponse = {
    status: boolean;
};

export const useRecoverAccount = (
    options?: Parameters<typeof useApiMutation<RecoverAccountInput, RecoverAccountResponse>>[2]
) => {
    return useApiMutation<RecoverAccountInput, RecoverAccountResponse>(
        ['auth', 'recover-account'],
        { url: 'auth/recover-account', method: 'POST' },
        options
    );
};