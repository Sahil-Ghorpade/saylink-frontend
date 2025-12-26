import apiClient from "./client";

export const fetchStoryFeed = async () => {
    const res = await apiClient("/stories/feed", {
        method: "GET",
    });
    return res;
};

export const createStory = async (formData) => {
    const res = await apiClient("/stories", {
        method: "POST",
        body: formData,
    });
    return res;
};

export const viewStory = async (storyId) => {
    const res = await apiClient(`/stories/${storyId}/view`, {
        method: "POST",
    });
    return res;
};

export const uploadStory = async (file) => {
    const formData = new FormData();
    formData.append("media", file);

    return await apiClient("/stories", {
        method: "POST",
        body: formData,
    });
};

export const fetchUserStories = async (userId) => {
    return await apiClient(`/stories/user/${userId}`);
};

export const replyToStory = async (storyId, text) => {
    return apiClient(`/stories/${storyId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
};

export const deleteStory = async (storyId) => {
    return await apiClient(`/stories/${storyId}`, {
        method: "DELETE",
    });
};  