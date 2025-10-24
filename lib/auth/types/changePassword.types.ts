export type ChangePasswordInput = {
    password: string;
    new_password: string;
    new_password_confirmation: string;
};

export type ChangePasswordResponse = {
    status: "success" | "error";
    error?: string;
    message?: string;
};