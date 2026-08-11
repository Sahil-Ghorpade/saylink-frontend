import { useState, useEffect } from "react";
import { fetchShareUsers } from "../../api/share";
import { sharePost } from "../../api/messages";
import "./SharePostModal.css";

function SharePostModal({ postId, onClose }) {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [sentTo, setSentTo] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShareUsers()
            .then(res => setUsers(res.users || []))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const filtered = users.filter(u =>
        u.username?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="share-overlay" onClick={onClose}>
            <div className="share-sheet" onClick={(e) => e.stopPropagation()}>
                {/* Handle */}
                <div className="share-handle"></div>

                {/* Header */}
                <div className="share-header">
                    <h6 className="mb-0 fw-bold">Share Post</h6>
                    <button className="share-close-btn" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* Search */}
                <div className="share-search-wrapper">
                    <i className="bi bi-search share-search-icon"></i>
                    <input
                        className="share-search-input"
                        placeholder="Search people…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                    {search && (
                        <button className="share-clear-btn" onClick={() => setSearch("")}>
                            <i className="bi bi-x-circle-fill"></i>
                        </button>
                    )}
                </div>

                {/* Users */}
                <div className="share-user-list">
                    {loading && (
                        <div className="text-center py-4">
                            <div className="spinner-border text-warning spinner-border-sm" role="status"></div>
                        </div>
                    )}

                    {!loading && filtered.length === 0 && (
                        <p className="text-muted text-center py-3" style={{ fontSize: "13px" }}>
                            No users found
                        </p>
                    )}

                    {filtered.map((user) => (
                        <div key={user._id} className="share-user-row">
                            <div className="share-user-info">
                                <img
                                    src={user.profileImage?.url || "/default-avatar.svg"}
                                    alt=""
                                    className="share-avatar"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.svg"; }}
                                />
                                <div>
                                    <span className="share-username">@{user.username}</span>
                                    {user.name && <small className="share-name">{user.name}</small>}
                                </div>
                            </div>

                            <button
                                className={`share-send-btn ${sentTo.includes(user._id) ? "sent" : ""}`}
                                disabled={sentTo.includes(user._id)}
                                onClick={async () => {
                                    try {
                                        await sharePost({ receiverId: user._id, postId });
                                        setSentTo(prev => [...prev, user._id]);
                                    } catch {
                                        // silently fail — could add toast here
                                    }
                                }}
                            >
                                {sentTo.includes(user._id) ? (
                                    <><i className="bi bi-check-lg me-1"></i>Sent</>
                                ) : (
                                    <><i className="bi bi-send me-1"></i>Send</>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SharePostModal;