import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { viewStory, replyToStory, deleteStory } from "../../api/stories";
import { AuthContext } from "../../context/AuthContext";
import ConfirmModal from "../common/ConfirmModal";
import "./StoryViewer.css";

function StoryViewer({ storyGroup, onClose, onStoryViewed, onStoryDeleted }) {
    const { user } = useContext(AuthContext);
    const currentUserId = user?._id;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showViewers, setShowViewers] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showPauseIcon, setShowPauseIcon] = useState(false);

    const timerRef = useRef(null);
    const videoRef = useRef(null);
    const elapsedRef = useRef(0);
    const isPausedRef = useRef(false);
    const lastViewedRef = useRef(null);
    const holdTimerRef = useRef(null);

    const isOwner = currentUserId?.toString() === storyGroup?.user?._id?.toString();
    const story = storyGroup?.stories?.[currentIndex];

    const goNext = useCallback(() => {
        if (storyGroup?.stories && currentIndex < storyGroup.stories.length - 1) {
            setCurrentIndex((i) => i + 1);
        } else {
            onClose();
        }
    }, [currentIndex, storyGroup, onClose]);

    const goPrev = () => {
        if (currentIndex > 0) setCurrentIndex((i) => i - 1);
    };

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    // Mark story viewed
    useEffect(() => {
        if (!story) return;
        if (lastViewedRef.current === story._id) return;
        lastViewedRef.current = story._id;
        viewStory(story._id).then((res) => {
            if (res?.ignored) return;
            onStoryViewed?.(story._id);
        });
    }, [currentIndex, story, onStoryViewed]);

    // Image timer
    useEffect(() => {
        if (!story || story.media?.type !== "image") return;
        if (isPaused) return;

        const duration = 5000;
        timerRef.current = setInterval(() => {
            if (isPausedRef.current) return;
            elapsedRef.current += 50;
            const percent = Math.min((elapsedRef.current / duration) * 100, 100);
            setProgress(percent);
            if (elapsedRef.current >= duration) {
                clearInterval(timerRef.current);
                elapsedRef.current = 0;
                setProgress(0);
                goNext();
            }
        }, 50);

        return () => clearInterval(timerRef.current);
    }, [currentIndex, story, isPaused, goNext]);

    // Video pause/play
    useEffect(() => {
        if (!videoRef.current || story?.media?.type !== "video") return;
        if (isPaused) videoRef.current.pause();
        else videoRef.current.play().catch(() => {});
    }, [isPaused, story]);

    // Reset on story change
    useEffect(() => {
        elapsedRef.current = 0;
        setProgress(0);
        setShowViewers(false);
    }, [currentIndex]);

    // Pause on tab hidden
    useEffect(() => {
        const handleVisibility = () => setIsPaused(document.hidden);
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, []);

    if (!storyGroup || !story) return null;

    const timeAgo = (date) => {
        const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
        return `${Math.floor(seconds / 86400)}d`;
    };

    const safeViewers = story.viewers
        .map((v) => (typeof v === "string" ? null : v))
        .filter(Boolean);

    // Touch/mouse hold to pause
    const handleHoldStart = () => {
        holdTimerRef.current = setTimeout(() => {
            setIsPaused(true);
            setShowPauseIcon(true);
        }, 120);
    };

    const handleHoldEnd = () => {
        clearTimeout(holdTimerRef.current);
        setIsPaused(false);
        setShowPauseIcon(false);
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteStory(story._id);
            onStoryDeleted?.(story._id);
            onClose();
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="story-viewer">

            {/* PAUSE ICON */}
            {showPauseIcon && (
                <div className="story-pause-indicator">
                    <i className="bi bi-pause-circle-fill"></i>
                </div>
            )}

            {/* CLOSE */}
            <button className="story-close" onClick={onClose} aria-label="Close">
                <i className="bi bi-x-lg"></i>
            </button>

            {/* DELETE */}
            {isOwner && (
                <button
                    className="story-delete"
                    disabled={deleting}
                    onClick={() => setShowDeleteConfirm(true)}
                >
                    <i className="bi bi-trash me-1"></i>
                    {deleting ? "Deleting…" : "Delete"}
                </button>
            )}

            {/* TOP BAR */}
            <div className="story-top">
                {/* Progress bars */}
                <div className="story-progress">
                    {storyGroup.stories.map((_, i) => (
                        <div key={i} className="story-progress-bar">
                            <div
                                className="story-progress-fill"
                                style={{
                                    width:
                                        i < currentIndex
                                            ? "100%"
                                            : i === currentIndex
                                            ? `${progress}%`
                                            : "0%",
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* User info */}
                <div className="story-header">
                    <img
                        src={storyGroup.user.profileImage?.url || "/default-avatar.svg"}
                        alt="avatar"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.svg"; }}
                    />
                    <div className="story-header-info">
                        <strong className="story-username">@{storyGroup.user.username}</strong>
                        <span className="story-time">{timeAgo(story.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* PREV / NEXT ZONES */}
            <div className="story-nav left" onClick={goPrev} />
            <div className="story-nav right" onClick={goNext} />

            {/* MEDIA — hold to pause */}
            <div
                className="story-media-wrapper"
                onMouseDown={handleHoldStart}
                onMouseUp={handleHoldEnd}
                onMouseLeave={handleHoldEnd}
                onTouchStart={handleHoldStart}
                onTouchEnd={handleHoldEnd}
            >
                {story.media.type === "image" && (
                    <img src={story.media.url} alt="" className="story-media" />
                )}

                {story.media.type === "video" && (
                    <video
                        ref={videoRef}
                        src={story.media.url}
                        className="story-media"
                        autoPlay
                        muted={isMuted}
                        playsInline
                        onTimeUpdate={() => {
                            const v = videoRef.current;
                            if (!v || !v.duration) return;
                            setProgress((v.currentTime / v.duration) * 100);
                        }}
                        onEnded={goNext}
                        onClick={() => {
                            setIsMuted(false);
                            if (videoRef.current) videoRef.current.muted = false;
                        }}
                    />
                )}

                {/* Hold-to-pause hint */}
                <div className="story-hold-hint">
                    Hold to pause
                </div>
            </div>

            {/* VIEW COUNT */}
            {isOwner && (
                <div className="story-views" onClick={() => setShowViewers(true)}>
                    <i className="bi bi-eye me-1"></i>
                    {story.viewers.length} views
                </div>
            )}

            {/* VIEWERS SHEET */}
            {showViewers && (
                <div className="viewers-sheet" onClick={() => setShowViewers(false)}>
                    <div className="viewers-sheet-content" onClick={(e) => e.stopPropagation()}>
                        <div className="viewers-sheet-handle"></div>
                        <h6><i className="bi bi-eye me-2"></i>Viewed by {story.viewers.length}</h6>

                        {safeViewers.length === 0 && (
                            <p className="text-muted text-center py-3">No views yet</p>
                        )}

                        {safeViewers.map((v) => (
                            <div key={v._id} className="viewer-row">
                                <img
                                    src={v.profileImage?.url || "/default-avatar.svg"}
                                    alt=""
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.svg"; }}
                                />
                                <span>@{v.username}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* REPLY */}
            {!isOwner && (
                <div className="story-reply">
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (!replyText.trim()) return;
                            try {
                                setSending(true);
                                await replyToStory(story._id, replyText);
                                setReplyText("");
                                onClose();
                            } finally {
                                setSending(false);
                            }
                        }}
                    >
                        <input
                            value={replyText}
                            placeholder={`Reply to @${storyGroup.user.username}…`}
                            onFocus={() => setIsPaused(true)}
                            onBlur={() => setIsPaused(false)}
                            onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button disabled={sending || !replyText.trim()}>
                            <i className="bi bi-send-fill"></i>
                        </button>
                    </form>
                </div>
            )}

            {/* CONFIRM DELETE MODAL */}
            {showDeleteConfirm && (
                <ConfirmModal
                    message="Delete this story? This can't be undone."
                    confirmLabel="Delete Story"
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                    danger={true}
                />
            )}
        </div>
    );
}

export default StoryViewer;