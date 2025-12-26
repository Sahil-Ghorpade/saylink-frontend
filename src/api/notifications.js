import apiClient from "./client";

export const fetchNotifications = async () => {
    return await apiClient("/notifications");
};

export const markNotificationsRead = async () => {
    return await apiClient("/notifications/read", {
        method: "PATCH",
    });
};