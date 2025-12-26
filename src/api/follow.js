import apiClient from "./client";

export const toggleFollow = (userId) => {
    return apiClient(`/follow/${userId}`, {
        method: "POST",
    });
};