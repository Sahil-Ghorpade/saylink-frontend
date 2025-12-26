import { createContext, useState, useEffect, useContext } from "react";
import { fetchNotifications } from "../api/notifications";
import { AuthContext } from "./AuthContext";

export const NotificationContext = createContext();

function NotificationProvider({ children }) {
    const { isAuthenticated } = useContext(AuthContext);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    
    useEffect(() => {
        if (!isAuthenticated) return;

        fetchNotifications().then((res) => {
            const list = res.notifications || [];
            setNotifications(list);

            const unread = list.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        });
    }, [isAuthenticated]);

    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    const removeNotification = (notificationId) => {
        setNotifications(prev =>
            prev.filter(n => n._id !== notificationId)
        );

        setUnreadCount(prev => Math.max(prev - 1, 0));
    };

    const markAllRead = () => {
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                removeNotification,
                markAllRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export default NotificationProvider;
    