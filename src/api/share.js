import apiClient from "./client";

export const fetchShareUsers = async () => {
    return await apiClient("/share/users");
};