import { useEffect, useState, useContext, useRef } from "react";
import { fetchFeed, toggleLike, addComment, deletePost, deleteComment } from "../../api/posts";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import StoriesRow from "../../components/stories/StoriesRow";
import StoryViewer from "../../components/stories/StoryViewer";
import StoryUpload from "../../components/stories/StoryUpload";
import SharePostModal from "../../components/share/SharePostModal";
import { fetchStoryFeed, createStory } from "../../api/stories";
import { SocketContext } from "../../context/SocketContext";
import { ToastContext } from "../../context/ToastContext";
import CommentPanel from "../../components/comments/CommentPanel";
import './Feed.css';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeStoryGroup, setActiveStoryGroup] = useState(null);
    const [stories, setStories] = useState([]);
    const [showStoryUpload, setShowStoryUpload] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [sharePostId, setSharePostId] = useState(null);
    const [openMenuPostId, setOpenMenuPostId] = useState(null);
    const [activeCommentPost, setActiveCommentPost] = useState(null);
    const pageRef = useRef(1);
    const fetchingRef = useRef(false);
    const { showToast } = useContext(ToastContext);
    const socket = useContext(SocketContext);
    const { user } = useContext(AuthContext);
    const currentUserId = user?._id;

    const loadStories = async () => {
        try {
            const storyData = await fetchStoryFeed();
            setStories(storyData.stories || []);
        } catch (err) {
            console.error(err.message);
        }
    };

    const loadFeed = async (pageNumber = 1) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;
        
        try {
            if (pageNumber === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const data = await fetchFeed(pageNumber);

            setPosts((prev) =>
                pageNumber === 1
                    ? data.posts
                    : [...prev, ...data.posts]
            );

            setHasMore(data.hasMore);
            setPage(pageNumber);
            pageRef.current = pageNumber; // 🔥 IMPORTANT
        } catch (error) {
            console.error(error.message);
        } finally {
            fetchingRef.current = false;
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        loadFeed(1);
        loadStories();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("story_viewed", ({ storyId, viewer }) => {
            setStories((prev) =>
                prev.map((s) =>
                    s._id === storyId
                        ? {
                            ...s,
                            viewers: [...s.viewers, viewer],
                        }
                        : s
                )
            );
        });

        return () => socket.off("story_viewed");
    }, [socket]);

    useEffect(() => {
            const handleScroll = () => {
                const scrollTop = window.scrollY;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;

                if (
                    windowHeight + scrollTop >= documentHeight - 200 &&
                    hasMore &&
                    !loadingMore &&
                    !fetchingRef.current
                ) {
                    loadFeed(pageRef.current + 1); // 🔥 FIX
                }
            };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loadingMore]);

    useEffect(() => {
        const handleClickOutside = () => setOpenMenuPostId(null);
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    if (loading && page === 1) {
        return (
            <div className="text-center mt-4 text-muted">
                Loading posts…
            </div>
        );
    }

    const handleStoryViewed = (storyId) => {
        setStories((prev) =>
            prev.map((s) =>
                s._id === storyId
                    ? {
                        ...s,
                        viewers: [...s.viewers, user.id],
                    }
                    : s
            )
        );
    };

    const handleStoryDeleted = (storyId) => {
        setStories(prev =>
            prev.filter(s => s._id !== storyId)
        );
        setActiveStoryGroup(null);
    };

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            
            <StoriesRow
                stories={stories}
                currentUserId={currentUserId}
                currentUser={user}
                onStoryClick={(group) => setActiveStoryGroup(group)}
                onYourStoryClick={() => setShowStoryUpload(true)}
            />

            {showStoryUpload && (
                <StoryUpload
                    onClose={() => setShowStoryUpload(false)}
                    onUploaded={loadStories}
                />
            )}

            {loading && (
                <div className="text-center mb-3">
                    <p>Loading feed...</p>
                </div>
            )}

            {posts.length === 0 && !loading && (
                <p className="text-muted text-center mt-4">
                    No posts yet. Start following users to see their posts.
                </p>
            )}

            {posts.map((post) => {
                const isOwner = post.author._id === currentUserId;
                const isLiked = post.likes?.includes(currentUserId);
                return (
                    <div
                        key={post._id}
                        className="card mb-4 feed-post"
                        style={{ borderColor: "#8ECAE6" }}
                    >
                        <div className="card-body">

                            {/* HEADER */}
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <Link
                                    to={`/profile/${post.author.username}`}
                                    className="d-flex align-items-center text-decoration-none"
                                >
                                    <img
                                        src={post.author.profileImage?.url}
                                        alt="profile"
                                        className="rounded-circle me-2"
                                        width="40"
                                        height="40"
                                    />
                                    <span className="fw-bold text-dark">
                                        @{post.author.username}
                                    </span>
                                </Link>

                                {isOwner && (
                                    <div className="position-relative">
                                        <button
                                            className="btn btn-sm btn-light"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuPostId(
                                                    openMenuPostId === post._id ? null : post._id
                                                )}
                                            }
                                        >
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </button>

                                        {openMenuPostId === post._id && (
                                            <div className="custom-dropdown">
                                                <button
                                                    className="dropdown-item text-danger"
                                                    onClick={async () => {
                                                        const confirmDelete = window.confirm(
                                                            "Delete this post?"
                                                        );
                                                        if (!confirmDelete) return;

                                                        try {
                                                            await deletePost(post._id);
                                                            setPosts(prev =>
                                                                prev.filter(p => p._id !== post._id)
                                                            );
                                                            setOpenMenuPostId(null);
                                                        } catch {
                                                            showToast("Failed to delete post", "error");
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* POST MEDIA */}
                            {post.image?.url && (
                                <Link to={`/post/${post._id}`}>
                                    <img
                                        src={post.image.url}
                                        alt="post"
                                        className="img-fluid rounded mb-2 post-image"
                                    />
                                </Link>
                            )}

                            {/* CAPTION */}
                            {post.caption && (
                                <p className="post-caption mb-2">
                                    {post.caption}
                                </p>
                            )}

                            {/* ACTIONS */}
                            <div className="post-actions d-flex justify-content-around align-items-center">
                                {/* LIKE */}
                                <button
                                    className="action-btn"
                                    onClick={async () => {
                                        try {
                                            await toggleLike(post._id);

                                            setPosts(prev =>
                                                prev.map(p =>
                                                    p._id === post._id
                                                        ? {
                                                            ...p,
                                                            likes: p.likes.includes(currentUserId)
                                                                ? p.likes.filter(id => id !== currentUserId)
                                                                : [...p.likes, currentUserId],
                                                        }
                                                        : p
                                                )
                                            );
                                        } catch {
                                            showToast("Failed to like post", "error");
                                        }
                                    }}
                                >
                                    <i className={`bi ${isLiked ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
                                    <span>{post.likes.length}</span>
                                </button>

                                {/* COMMENT */}
                                <button
                                    className="action-btn"
                                    onClick={() => {
                                        setActiveCommentPost(post);
                                    }}
                                >
                                    <i className="bi bi-chat"></i>
                                    <span>{post.comments.length}</span>
                                </button>

                                {/* SHARE */}
                                <button
                                    className="action-btn"
                                    onClick={() => {
                                        setSharePostId(post._id);
                                        setShowShare(true);
                                    }}
                                >
                                    <i className="bi bi-share"></i>
                                </button>
                            </div>

                        </div>
                    </div>
            )})}

            {showShare && (
                <SharePostModal
                    postId={sharePostId}
                    onClose={() => setShowShare(false)}
                />
            )}

            {activeCommentPost && (
                <CommentPanel
                    post={activeCommentPost}
                    onClose={() => setActiveCommentPost(null)}
                    onUpdate={(payload, type) => {
                        setPosts(prev =>
                            prev.map(p =>
                                p._id === activeCommentPost._id
                                    ? {
                                        ...p,
                                        comments:
                                            type === "add"
                                                ? [...p.comments, payload]
                                                : p.comments.filter(c => c._id !== payload),
                                    }
                                    : p
                            )
                        );
                    }}
                />
            )}

            {loadingMore && (
                <p className="text-center text-muted mb-3">
                    Loading more posts…
                </p>
            )}

            {!hasMore && posts.length > 0 && (
                <p className="text-center text-muted mb-3">
                    You’ve reached the end
                </p>
            )}

            {activeStoryGroup && (
                <StoryViewer
                    storyGroup={activeStoryGroup}
                    onClose={() => setActiveStoryGroup(null)}
                    onStoryViewed={handleStoryViewed}  
                    onStoryDeleted={handleStoryDeleted}
                />
            )}

        </div>
    );
}

export default Feed;