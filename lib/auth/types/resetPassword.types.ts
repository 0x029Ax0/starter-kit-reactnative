export type ResetPasswordInput = {
    password: string;
    new_password: string;
    new_password_confirmation: string;
};

export type ResetPasswordResponse = {
    status: "success" | "error";
    error?: string;
    message?: string;
};