export type UpdateProfileInput = {
    name: string;
    email: string;
    avatar?: File;
};

export type UpdateProfileResponse = {
    status: "success" | "error";
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string;
    };
    error?: string;
    message?: string;
};