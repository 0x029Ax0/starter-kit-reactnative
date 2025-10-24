export type RegisterInput = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type RegisterResponse = {
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