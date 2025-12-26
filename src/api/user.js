import apiClient from "./client";

export const updateSettings = (formData) => {
    return apiClient("/users/settings", {
        method: "PATCH",
        body: formData,
    });
};

export const searchUsers = (query) => {
    return apiClient(`/users/search?q=${query}`);
};