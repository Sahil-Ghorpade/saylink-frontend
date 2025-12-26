import apiClient from "./client";

export const fetchProfile = (username) => {
    return apiClient(`/profile/${username}`);
};