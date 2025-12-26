import { useEffect, useState, useContext } from "react";
import { fetchConversations } from "../../api/messages";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import "./Messages.css";

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

    if (c.lastMessageType === "post") return "📸 Sent a post";

    if (isObjectId(c.lastMessage)) {
        return "📸 Sent a post";
    }

    return "No messages yet";
};


    if (!user || loading) {
        return (
            <p className="text-center mt-4 text-muted">
                Loading messages…
            </p>
        );
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            {/* HEADER */}
            <div className="messages-header">
                <h4>Messages</h4>
                <Link
                    to="/messages/requests"
                    className="btn btn-sm btn-outline-secondary"
                >
                    Requests
                </Link>
            </div>

            {/* EMPTY STATE */}
            {conversations.length === 0 && (
                <p className="text-muted text-center mt-4">
                    No conversations yet
                </p>
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
                            <img
                                src={
                                    otherUser?.profileImage?.url ||
                                    "/default-avatar.png"
                                }
                                alt="avatar"
                                className="conversation-avatar"
                            />

                            {/* Info */}
                            <div className="conversation-content">
                                <strong>@{otherUser?.username}</strong>
                                <p className="conversation-preview">
                                    {getLastMessagePreview(c)}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Messages;