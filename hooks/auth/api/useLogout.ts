import { useApiMutation } from '@/lib/http';

export type LogoutResponse = {
    status: string;
};

export const useLogout = (
    options?: Parameters<typeof useApiMutation<null, LogoutResponse>>[2]
) => {
    return useApiMutation<null, LogoutResponse>(
        ['auth', 'logout'],
        { url: 'auth/logout', method: 'POST' },
        options
    );
};