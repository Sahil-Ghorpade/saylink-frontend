import apiClient from "./client";

export const loginUser = (formData) => {
    return apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const signupUser = (formData) => {
    return apiClient("/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json",
        },
    });
};
