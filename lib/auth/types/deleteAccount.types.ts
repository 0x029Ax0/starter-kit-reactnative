export type DeleteAccountInput = {
    password: string;
};

export type DeleteAccountResponse = {
    status: "success" | "error";
    error?: string;
    message?: string;
};