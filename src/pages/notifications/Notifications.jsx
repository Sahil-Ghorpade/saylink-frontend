import { useEffect, useContext, useState } from "react";
import { fetchNotifications, markNotificationsRead } from "../../api/notifications";
import { NotificationContext } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

function Notifications() {
    const { notifications, markAllRead } = useContext(NotificationContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                await fetchNotifications();
                await markNotificationsRead();
                markAllRead();
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, []);

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
            case "like":
                return "liked your post";
            case "comment":
                return "commented on your post";
            case "follow":
                return "started following you";
            case "follow_request":
                return "sent you a follow request";
            default:
                return "";
        }
    };

    if (loading) {
        return <p className="text-center mt-4 text-muted">Loading notifications…</p>;
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <h4 className="mb-4">Notifications</h4>

            {notifications.length === 0 && (
                <p className="text-muted text-center">
                    You’re all caught up 🎉
                </p>
            )}

            <div className="notification-list">
                {notifications.map((n) => (
                    <div
                        key={n._id}
                        className={`notification-item ${n.isRead ? "" : "unread"}`}
                        onClick={() => handleNotificationClick(n)}
                    >
                        {/* Avatar */}
                        <img
                            src={
                                n.sender?.profileImage?.url ||
                                "/default-avatar.png"
                            }
                            alt="avatar"
                            className="notification-avatar"
                        />

                        {/* Content */}
                        <div className="notification-content">
                            <p className="mb-1">
                                <strong>@{n.sender?.username}</strong>{" "}
                                {getMessage(n)}
                            </p>

                            <small className="text-muted">
                                {new Date(n.createdAt).toLocaleString()}
                            </small>
                        </div>
                        {!n.isRead && <span className="unread-dot" />}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notifications;