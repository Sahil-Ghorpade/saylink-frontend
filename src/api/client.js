const BASE_URL = "https://saylink-backend.onrender.com/api";

const apiClient = async (endpoint, options = {}) => {
    const token = localStorage.getItem("saylink_token");

    const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        throw new Error(
            typeof data === "string" ? "Server error" : data.message
        );
    }

    return data;
};

export default apiClient;