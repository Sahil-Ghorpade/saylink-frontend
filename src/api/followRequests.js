import apiClient from "./client";

export const fetchFollowRequests = () => {
    return apiClient("/follow-requests");
};

export const acceptFollowRequest = (userId) => {
    return apiClient(`/follow-requests/accept/${userId}`, {
        method: "POST",
    });
};

export const rejectFollowRequest = (userId) => {
    return apiClient(`/follow-requests/reject/${userId}`, {
        method: "POST",
    });
};