import apiClient from "./client";

export const fetchFeed = async (page = 1) => {
    return await apiClient(`/posts/feed?page=${page}`);
};

export const createPost = (postData) => {
    return apiClient("/posts", {
        method: "POST",
        body: postData,
    });
};

export const toggleLike = (postId) => {
    return apiClient(`/posts/${postId}/like`, {
        method: "POST",
    });
};

export const addComment = (postId, text) => {
    return apiClient(`/posts/${postId}/comment`, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const deletePost = async (postId) => {
    return await apiClient(`/posts/${postId}`, {
        method: "DELETE",
    });
};

export const deleteComment = async (postId, commentId) => {
    return await apiClient(
        `/posts/${postId}/comments/${commentId}`, { 
            method: "DELETE",
    });
};

export const fetchSinglePost = async (postId) => {
    return await apiClient(`/posts/${postId}`);
};