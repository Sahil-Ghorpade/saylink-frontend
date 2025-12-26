import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { NotificationContext } from "./NotificationContext";

export const SocketContext = createContext(null);

function SocketProvider({ children }) {
    const { isAuthenticated } = useContext(AuthContext);
    const { addNotification, removeNotification } = useContext(NotificationContext);
    const [socket, setSocket] = useState(null);
    
    useEffect(() => {
        if (!isAuthenticated) return;

        const token = localStorage.getItem("saylink_token");
        if (!token) return;

        const socketInstance = io("https://saylink-backend.onrender.com", {
            auth: {
                token,
            },
            withCredentials: true,
        });

        setSocket(socketInstance);

        socketInstance.on("connect", () => {
            console.log("Socket connected:", socketInstance.id);
        });

        socketInstance.on("new_notification", (notification) => {
            addNotification(notification);
        });

        socketInstance.on("remove_notification", ({ notificationId }) => {
            removeNotification(notificationId);
        });

        socketInstance.on("story_viewed", ({ storyId, viewerId }) => {
            console.log("Story viewed realtime:", storyId, viewerId);
        });

        socketInstance.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        return () => {
            socketInstance.disconnect();
            setSocket(null);
        };
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;