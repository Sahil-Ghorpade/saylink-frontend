import { useEffect, useState, useContext } from "react";
import { fetchConversations } from "../../api/messages";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import "./Messages.css";

function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return new Date(dateStr).toLocaleDateString();
}

function Messages() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchConversations();
                setConversations(data.conversations || []);

                if (socket && socket.connected && data.conversations?.length > 0) {
                    const ids = data.conversations.map(c => c._id);
                    socket.emit("join_conversations", ids);
                }
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [socket]);

    const isObjectId = (val) =>
        typeof val === "string" && /^[a-f\d]{24}$/i.test(val);

    const getLastMessagePreview = (c) => {
        if (c.lastMessage && !isObjectId(c.lastMessage)) {
            return c.lastMessage;
        }
        if (c.lastMessageType === "post" || isObjectId(c.lastMessage)) {
            return "📸 Shared a post";
        }
        return "Start a conversation";
    };

    if (!user || loading) {
        return (
            <div className="container mt-4" style={{ maxWidth: "600px" }}>
                <div className="glass-card p-5 text-center">
                    <div className="spinner-border text-warning mb-2" role="status"></div>
                    <p className="text-muted mb-0">Loading messages…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            {/* HEADER */}
            <div className="messages-header mb-4">
                <h4 className="mb-0 fw-bold">Messages</h4>
                <Link to="/messages/requests" className="messages-requests-btn">
                    <i className="bi bi-inbox me-1"></i> Requests
                </Link>
            </div>

            {/* EMPTY STATE */}
            {conversations.length === 0 && (
                <div className="glass-card p-5 text-center">
                    <i className="bi bi-chat-dots text-muted mb-3 d-block" style={{ fontSize: "2.5rem" }}></i>
                    <h6 className="fw-semibold mb-1">No conversations yet</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                        Visit a profile and tap <strong>Message</strong> to start chatting.
                    </p>
                </div>
            )}

            {/* CONVERSATIONS */}
            <div className="conversation-list">
                {conversations.map((c) => {
                    const otherUser = c.participants.find(
                        (p) => p._id?.toString() !== user?._id?.toString()
                    );

                    return (
                        <Link
                            key={c._id}
                            to={`/messages/${c._id}`}
                            className="conversation-item"
                        >
                            {/* Avatar */}
                            <div className="conversation-avatar-wrapper">
                                <img
                                    src={otherUser?.profileImage?.url || "/default-avatar.svg"}
                                    alt="avatar"
                                    className="conversation-avatar"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.svg"; }}
                                />
                            </div>

                            {/* Info */}
                            <div className="conversation-content">
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="conversation-username">
                                        @{otherUser?.username}
                                    </span>
                                    <span className="conversation-time">
                                        {timeAgo(c.updatedAt)}
                                    </span>
                                </div>
                                <p className="conversation-preview">
                                    {getLastMessagePreview(c)}
                                </p>
                            </div>

                            {/* Arrow */}
                            <i className="bi bi-chevron-right text-muted" style={{ fontSize: "12px" }}></i>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Messages;