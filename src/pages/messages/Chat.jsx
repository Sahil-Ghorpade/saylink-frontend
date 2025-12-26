import { useEffect, useState, useContext, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMessages, sendMessage } from "../../api/messages";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import PostPreview from "./PostPreview";
import PageHeader from "../../components/comments/PageHeader";
import "./Chat.css";

function Chat() {
    const { conversationId } = useParams();
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);

    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);

    const typingTimeoutRef = useRef(null);
    const messagesRef = useRef(null);

    /* -------- LOAD MESSAGES -------- */
    useEffect(() => {
        const loadMessages = async () => {
            const data = await fetchMessages(conversationId);
            setMessages(data.messages || []);
            setConversation(data.conversation || null);
        };
        loadMessages();
    }, [conversationId]);

    /* ✅ OPEN CHAT AT LAST MESSAGE */
    useLayoutEffect(() => {
        if (!messagesRef.current) return;
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [messages.length]);

    /* -------- SOCKET: NEW MESSAGE -------- */
    useEffect(() => {
        if (!socket) return;

        const onNewMessage = (message) => {
            if (String(message.conversation) !== String(conversationId)) return;

            setMessages((prev) => [...prev, { ...message, delivered: true }]);

            socket.emit("message_delivered", {
                conversationId,
                messageId: message._id,
            });
        };

        socket.on("new_message", onNewMessage);
        return () => socket.off("new_message", onNewMessage);
    }, [socket, conversationId]);

    /* -------- SOCKET: TYPING -------- */
    useEffect(() => {
        if (!socket) return;

        socket.on("user_typing", ({ conversationId: cid }) => {
            if (cid === conversationId) setTypingUser(true);
        });

        socket.on("user_stop_typing", ({ conversationId: cid }) => {
            if (cid === conversationId) setTypingUser(null);
        });

        return () => {
            socket.off("user_typing");
            socket.off("user_stop_typing");
        };
    }, [socket, conversationId]);

    /* -------- SOCKET: DELIVERY -------- */
    useEffect(() => {
        if (!socket) return;

        socket.on("message_delivered_ack", ({ messageId }) => {
            setMessages((prev) =>
                prev.map((m) =>
                    m._id === messageId ? { ...m, delivered: true } : m
                )
            );
        });

        return () => socket.off("message_delivered_ack");
    }, [socket]);

    /* -------- SOCKET: SEEN -------- */
    useEffect(() => {
        if (!socket) return;

        socket.emit("messages_seen", { conversationId });

        socket.on("messages_seen_ack", ({ conversationId: cid }) => {
            if (cid === conversationId) {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.delivered ? { ...m, seen: true } : m
                    )
                );
            }
        });

        return () => socket.off("messages_seen_ack");
    }, [socket, conversationId]);

    /* -------- CLEANUP -------- */
    useEffect(() => {
        return () => {
            socket?.emit("stop_typing", { conversationId });
        };
    }, [socket, conversationId]);

    /* -------- SEND MESSAGE -------- */
    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        await sendMessage(conversationId, text);
        setText("");

        socket.emit("stop_typing", { conversationId });
        setIsTyping(false);
    };

    /* -------- TYPING HANDLER -------- */
    const handleTyping = () => {
        if (!socket) return;

        if (!isTyping) {
            socket.emit("typing", { conversationId });
            setIsTyping(true);
        }

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop_typing", { conversationId });
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="chat-page">

            <div className="chat-container">
                {/* HEADER */}
                <PageHeader title="Chat" backTo="/messages" />

                {/* SCROLLABLE MESSAGES */}
                <div className="chat-messages" ref={messagesRef}>
                    {messages.map((m) => {
                        const isOwn = m.sender._id === user._id;

                        return (
                            <div
                                key={m._id}
                                className={`chat-row ${isOwn ? "own" : ""}`}
                            >
                                <div className="chat-bubble">
                                    {m.type === "text" && (
                                        <p className="chat-text">{m.text}</p>
                                    )}

                                    {m.type === "post" && m.post && (
                                        <PostPreview post={m.post} />
                                    )}
                                </div>

                                {isOwn && (
                                    <span className="chat-status">
                                        {m.seen
                                            ? "✓✓ Seen"
                                            : m.delivered
                                            ? "✓ Delivered"
                                            : "✓"}
                                    </span>
                                )}
                            </div>
                        );
                    })}

                    {typingUser && (
                        <div className="typing-indicator">
                            Typing…
                        </div>
                    )}
                </div>

                {/* INPUT */}
                <form className="chat-input-bar" onSubmit={handleSend}>
                    <input
                        className="chat-input"
                        placeholder="Type a message…"
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            handleTyping();
                        }}
                    />
                </form>
            </div>
        </div>
    );
}

export default Chat;
