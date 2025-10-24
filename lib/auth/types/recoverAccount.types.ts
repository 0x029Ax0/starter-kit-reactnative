export type RecoverAccountInput = {
    email: string;
};

export type RecoverAccountResponse = {
    status: "success" | "error";
    error?: string;
    message?: string;
};