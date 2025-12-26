import { useState, useEffect, useRef, useContext } from "react";
import { viewStory, replyToStory, deleteStory } from "../../api/stories";
import { AuthContext } from "../../context/AuthContext";
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

    const timerRef = useRef(null);
    const videoRef = useRef(null);
    const elapsedRef = useRef(0);
    const isPausedRef = useRef(false);
    const lastViewedRef = useRef(null);

    const isOwner =
        currentUserId?.toString() === storyGroup.user._id?.toString();

    const story = storyGroup.stories[currentIndex];

    if (!storyGroup || !story) {
        onClose();
        return null;
    }

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        if (!story) return;
        if (lastViewedRef.current === story._id) return;

        lastViewedRef.current = story._id;

        viewStory(story._id).then((res) => {
            if (res?.ignored) return;
            onStoryViewed?.(story._id);
        });
    }, [currentIndex, story]);

    useEffect(() => {
        if (!story || story.media.type !== "image") return;
        if (isPaused) return;

        const duration = 5000;

        timerRef.current = setInterval(() => {
            if (isPausedRef.current) return;

            elapsedRef.current += 50;
            const percent = Math.min(
                (elapsedRef.current / duration) * 100,
                100
            );

            setProgress(percent);

            if (elapsedRef.current >= duration) {
                clearInterval(timerRef.current);
                elapsedRef.current = 0;
                setProgress(0);
                goNext();
            }
        }, 50);

        return () => clearInterval(timerRef.current);
    }, [currentIndex, story, isPaused]);

    useEffect(() => {
        if (!videoRef.current || story.media.type !== "video") return;

        if (isPaused) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(() => {});
        }
    }, [isPaused, story]);

    useEffect(() => {
        elapsedRef.current = 0;
        setProgress(0);
        setShowViewers(false);
    }, [currentIndex]);

    useEffect(() => {
        const handleVisibility = () =>
            setIsPaused(document.hidden);

        document.addEventListener("visibilitychange", handleVisibility);
        return () =>
            document.removeEventListener("visibilitychange", handleVisibility);
    }, []);

    const goNext = () => {
        if (currentIndex < storyGroup.stories.length - 1) {
            setCurrentIndex((i) => i + 1);
        } else {
            onClose();
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((i) => i - 1);
        }
    };

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

    return (
        <div className="story-viewer">
            {/* CLOSE */}
            <button className="story-close" onClick={onClose}>
                ✕
            </button>

            {/* DELETE */}
            {isOwner && (
                <button
                    className="story-delete"
                    disabled={deleting}
                    onClick={async () => {
                        if (!window.confirm("Delete this story?")) return;
                        try {
                            setDeleting(true);
                            await deleteStory(story._id);
                            onStoryDeleted?.(story._id);
                            onClose();
                        } finally {
                            setDeleting(false);
                        }
                    }}
                >
                    Delete
                </button>
            )}

            {/* TOP BAR */}
            <div className="story-top">
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

                <div className="story-header">
                    <img
                        src={storyGroup.user.profileImage?.url}
                        alt=""
                    />
                    <div>
                        <strong>@{storyGroup.user.username}</strong>
                        <div className="story-time">
                            {timeAgo(story.createdAt)}
                        </div>
                    </div>
                </div>
            </div>

            {/* PREV / NEXT ZONES */}
            <div className="story-nav left" onClick={goPrev} />
            <div className="story-nav right" onClick={goNext} />

            {/* MEDIA */}
            <div
                className="story-media-wrapper"
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {story.media.type === "image" && (
                    <img
                        src={story.media.url}
                        alt=""
                        className="story-media"
                    />
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
                            setProgress(
                                (v.currentTime / v.duration) * 100
                            );
                        }}
                        onEnded={goNext}
                        onClick={() => {
                            setIsMuted(false);
                            videoRef.current.muted = false;
                        }}
                    />
                )}
            </div>

            {/* VIEW COUNT */}
            {isOwner && (
                <div
                    className="story-views"
                    onClick={() => setShowViewers(true)}
                >
                    👁 {story.viewers.length} views
                </div>
            )}

            {/* VIEWERS SHEET */}
            {showViewers && (
                <div
                    className="viewers-sheet"
                    onClick={() => setShowViewers(false)}
                >
                    <div
                        className="viewers-sheet-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h6>Viewed by {story.viewers.length}</h6>

                        {safeViewers.length === 0 && (
                            <p className="text-muted">No views yet</p>
                        )}

                        {safeViewers.map((v) => (
                            <div key={v._id} className="viewer-row">
                                <img src={v.profileImage?.url} alt="" />
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
                            placeholder={`Reply to @${storyGroup.user.username}`}
                            onFocus={() => setIsPaused(true)}
                            onBlur={() => setIsPaused(false)}
                            onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button disabled={sending || !replyText.trim()}>
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default StoryViewer;