import z from "zod";

export const loginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Min 8 characters'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export type LoginResponse = {
    status: "success" | "error";
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string;
    };
    error?: string;
    message?: string;
};