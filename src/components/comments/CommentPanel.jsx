import { useEffect, useState, useContext, useRef } from "react";
import { addComment, deleteComment } from "../../api/posts";
import { AuthContext } from "../../context/AuthContext";
import { ToastContext } from "../../context/ToastContext";
import { Link } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import './CommentPanel.css';

function CommentPanel({ post, onClose, onUpdate }) {
    const { user } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);

    const [comments, setComments] = useState(post.comments || []);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
  
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    useEffect(() => {
        setComments(post.comments || []);
    }, [post._id]);

    const handleSubmit = async () => {
        if (!text.trim()) return;

        try {
            setLoading(true);

            const res = await addComment(post._id, text);

            setComments(prev => [...prev, res.comment]);
            onUpdate(res.comment, "add");

            setText("");
            setShowEmoji(false);
        } catch {
            showToast("Failed to add comment", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await deleteComment(post._id, commentId);
            setComments(prev => prev.filter(c => c._id !== commentId));
            onUpdate(commentId, "delete");
        } catch {
            showToast("Delete failed", "error");
        }
    };

    return (
        <div className="comment-overlay" onClick={onClose}>
            <div
                className="comment-panel"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="comment-header">
                    <h6>Comments</h6>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* COMMENTS LIST */}
                <div className="comment-list">
                    {comments.map((c) => {
                        const canDelete =
                            c.author._id === user._id ||
                            post.author._id === user._id;

                        return (
                            <div key={c._id} className="comment-row">
                            <Link
                                to={`/profile/${c.author.username}`}
                                className="comment-avatar-link"
                            >
                                <img
                                    src={
                                        c.author.profileImage?.url ||
                                        "/default-avatar.png"
                                    }
                                    alt="avatar"
                                    className="comment-avatar"
                                />
                            </Link>

                                <div className="comment-content">
                                    <Link
                                        to={`/profile/${c.author.username}`}
                                        className="comment-username"
                                    >
                                        <strong>@{c.author.username}</strong>
                                    </Link>
                                    <span className="comment-text">
                                        {c.text}
                                    </span>
                                </div>

                                {canDelete && (
                                    <div className="comment-menu">
                                        <button
                                            className="comment-menu-btn"
                                            onClick={() => {
                                                const ok = window.confirm("Delete comment?");
                                                if (!ok) return;
                                                handleDelete(c._id);
                                            }}
                                        >
                                            <i className="bi bi-three-dots"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="comment-input-wrapper">
                    {/* Emoji button */}
                    <button
                        type="button"
                        className="emoji-btn"
                        onClick={() => setShowEmoji(prev => !prev)}
                    >
                        😊
                    </button>

                    {/* Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        className="comment-input"
                        placeholder="Add a comment..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    {/* Send */}
                    <button
                        className="send-btn"
                        disabled={!text.trim() || loading}
                        onClick={handleSubmit}
                    >
                        Send
                    </button>
                </div>

                {showEmoji && (
                    <div
                        className="emoji-picker-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <EmojiPicker
                            onEmojiClick={(emojiData) => {
                                setText(prev => prev + emojiData.emoji);
                                setShowEmoji(false);
                            }}
                            height={350}
                        />
                    </div>
                )}

            </div>
        </div>
    );
}

export default CommentPanel;