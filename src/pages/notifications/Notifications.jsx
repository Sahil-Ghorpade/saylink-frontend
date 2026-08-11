import { useEffect, useContext, useState } from "react";
import { fetchNotifications, markNotificationsRead } from "../../api/notifications";
import { NotificationContext } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

function getIcon(type) {
    switch (type) {
        case "like": return { icon: "bi-heart-fill", color: "#e11d48" };
        case "comment": return { icon: "bi-chat-fill", color: "#f59e0b" };
        case "follow": return { icon: "bi-person-check-fill", color: "#10b981" };
        case "follow_request": return { icon: "bi-person-plus-fill", color: "#f59e0b" };
        default: return { icon: "bi-bell-fill", color: "#a1a1aa" };
    }
}

function Notifications() {
    const { notifications, markAllRead } = useContext(NotificationContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const loadNotifications = async () => {
            try {
                await fetchNotifications();
                await markNotificationsRead();
                if (isMounted) markAllRead();
            } catch (err) {
                console.error(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadNotifications();
        return () => { isMounted = false; };
    }, [markAllRead]);

    const handleNotificationClick = (n) => {
        if ((n.type === "like" || n.type === "comment") && n.post?._id) {
            navigate(`/post/${n.post._id}`);
            return;
        }
        if (n.type === "follow" && n.sender?.username) {
            navigate(`/profile/${n.sender.username}`);
            return;
        }
        if (n.type === "follow_request") {
            navigate("/follow-requests");
        }
    };

    const getMessage = (n) => {
        switch (n.type) {
            case "like": return "liked your post";
            case "comment": return "commented on your post";
            case "follow": return "started following you";
            case "follow_request": return "sent you a follow request";
            default: return "";
        }
    };

    if (loading) {
        return (
            <div className="container mt-4" style={{ maxWidth: "600px" }}>
                <div className="glass-card p-5 text-center">
                    <div className="spinner-border text-warning mb-2" role="status"></div>
                    <p className="text-muted mb-0">Loading notifications…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h4 className="mb-0 fw-bold">Notifications</h4>
                {notifications.length > 0 && (
                    <span className="badge rounded-pill" style={{ background: "var(--primary-gradient)", fontSize: "12px", padding: "5px 10px" }}>
                        {notifications.length}
                    </span>
                )}
            </div>

            {notifications.length === 0 && (
                <div className="glass-card p-5 text-center">
                    <i className="bi bi-bell-slash text-muted mb-3 d-block" style={{ fontSize: "2.5rem" }}></i>
                    <h6 className="fw-semibold mb-1">All caught up!</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>You have no new notifications.</p>
                </div>
            )}

            <div className="notification-list">
                {notifications.map((n) => {
                    const { icon, color } = getIcon(n.type);
                    return (
                        <div
                            key={n._id}
                            className={`notification-item ${n.isRead ? "" : "unread"}`}
                            onClick={() => handleNotificationClick(n)}
                        >
                            {/* Avatar with type badge */}
                            <div className="notif-avatar-wrapper">
                                <img
                                    src={n.sender?.profileImage?.url || "/default-avatar.svg"}
                                    alt="avatar"
                                    className="notification-avatar"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.svg"; }}
                                />
                                <span className="notif-type-badge" style={{ background: color }}>
                                    <i className={`bi ${icon}`}></i>
                                </span>
                            </div>

                            {/* Content */}
                            <div className="notification-content">
                                <p className="mb-0">
                                    <strong>@{n.sender?.username}</strong>{" "}
                                    {getMessage(n)}
                                </p>
                                <small className="text-muted">{timeAgo(n.createdAt)}</small>
                            </div>

                            {/* Unread dot */}
                            {!n.isRead && <span className="unread-dot" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Notifications;