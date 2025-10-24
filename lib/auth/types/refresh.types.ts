import { User } from "./User.type";

export type RefreshResponse = {
    status: "success" | "error";
    user: User;
    error?: string;
    message?: string;
};