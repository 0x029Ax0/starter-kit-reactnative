import { postJSON } from '@/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type LoginInput = { email: string; password: string };
type LoginResponse = {
    token: string;
    user: { id: string; email: string; name?: string };
};

export function useLogin() {
    const qc = useQueryClient();

    return useMutation({
        mutationKey: ['auth', 'login'],
        mutationFn: (input: LoginInput) => postJSON<LoginResponse>('/auth/login', input),

        // keep the UI snappy and set auth state
        onSuccess: (data) => {
            // store token wherever you manage auth (secure store, context, etc.)
            // Example: await SecureStore.setItemAsync('token', data.token)

            // seed current user cache so UI updates instantly
            qc.setQueryData(['auth', 'me'], data.user);
        },
    });
}