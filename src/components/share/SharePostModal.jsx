import { useState, useEffect } from "react";
import { fetchShareUsers } from "../../api/share";
import { sharePost } from "../../api/messages";

function SharePostModal({ postId, onClose }) {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [sentTo, setSentTo] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchShareUsers()
            .then(res => setUsers(res.users))
            .finally(() => setLoading(false));
    }, []);

        useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 3000,
                display: "flex",
                alignItems: "flex-end",
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "white",
                    width: "100%",
                    maxHeight: "70%",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    padding: 16,
                    overflowY: "auto",
                }}
            >
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Share post</h6>
                    <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* SEARCH */}
                <input
                    className="form-control mb-3"
                    placeholder="Search people"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* USERS LIST */}
                {loading && <p className="text-center">Loading...</p>}

                {users.map((user) => (
                    <div
                        key={user._id}
                        className="d-flex align-items-center justify-content-between mb-2"
                    >
                        <div className="d-flex align-items-center gap-2">
                            <img
                                src={user.profileImage?.url}
                                width={36}
                                height={36}
                                style={{ borderRadius: "50%" }}
                            />
                            <span>@{user.username}</span>
                        </div>

                        <button
                            className="btn btn-sm btn-primary"
                            disabled={sentTo.includes(user._id)}
                            onClick={async () => {
                                try {
                                    await sharePost({
                                        receiverId: user._id,
                                        postId, // ✅ use prop
                                    });

                                    setSentTo(prev => [...prev, user._id]);
                                } catch (err) {
                                    console.error(err);
                                    alert("Failed to share post");
                                }
                            }}
                        >
                            {sentTo.includes(user._id) ? "Sent" : "Send"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SharePostModal;