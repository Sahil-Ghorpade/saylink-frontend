import apiClient from "./client";

// Active conversations
export const fetchConversations = () => {
    return apiClient("/conversations");
};

// Message requests
export const fetchMessageRequests = () => {
    return apiClient("/conversations/requests");
};

// Accept / Reject
export const acceptMessageRequest = (id) => {
    return apiClient(`/conversations/${id}/accept`, {
        method: "POST",
    });
};

export const rejectMessageRequest = (id) => {
    return apiClient(`/conversations/${id}/reject`, {
        method: "DELETE",
    });
};

// Messages
export const fetchMessages = (conversationId) => {
    return apiClient(`/messages/${conversationId}`);
};

export const sendMessage = (conversationId, text) => {
    return apiClient(`/messages/${conversationId}`, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const startConversation = (userId) => {
    return apiClient(`/conversations/${userId}`, {
        method: "POST",
    });
};

export const sharePost = (data) =>
    apiClient("/share/share", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
