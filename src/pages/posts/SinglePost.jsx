import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchSinglePost } from "../../api/posts";
import { AuthContext } from "../../context/AuthContext";
import SharePostModal from "../../components/share/SharePostModal";
import { toggleLike } from "../../api/posts";
import { ToastContext } from "../../context/ToastContext";
import CommentPanel from "../../components/comments/CommentPanel";
import { deletePost } from "../../api/posts";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/comments/PageHeader";
import "./SinglePost.css";

function SinglePost() {
    const { postId } = useParams();
    const { user } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showShare, setShowShare] = useState(false);
    const [sharePostId, setSharePostId] = useState(null);
    const [activeCommentPost, setActiveCommentPost] = useState(null);
    const [openMenu, setOpenMenu] = useState(false);

    const { showToast } = useContext(ToastContext);

    const isLiked = post?.likes?.includes(user?._id);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSinglePost(postId)
            .then(res => setPost(res.post))
            .finally(() => setLoading(false));
    }, [postId]);

    useEffect(() => {
        const closeMenu = () => setOpenMenu(false);
        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);

    if (loading) {
        return <p className="text-center mt-4">Loading post…</p>;
    }

    if (!post) {
        return <p className="text-center mt-4">Post not found</p>;
    }

    const isOwner = user?._id === post.author._id;

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <PageHeader title="Back" />

            <div className="card single-post-card">

                {/* HEADER */}
                <div className="card-body pb-2">
                    <div className="d-flex justify-content-between align-items-center">
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
                            <strong className="text-dark">
                                @{post.author.username}
                            </strong>
                        </Link>

                        {isOwner && (
                            <div className="position-relative">
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenu(prev => !prev);
                                    }}
                                >
                                    <i className="bi bi-three-dots-vertical"></i>
                                </button>

                                {openMenu && (
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
                                                    showToast("Post deleted", "success");
                                                    navigate("/");
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
                </div>

                {/* MEDIA */}
                {post.image?.url && (
                    <img
                        src={post.image.url}
                        alt="post"
                        className="img-fluid post-media"
                    />
                )}

                {post.video?.url && (
                    <video
                        src={post.video.url}
                        controls
                        className="w-100 post-media"
                    />
                )}

                {/* CAPTION */}
                {post.caption && (
                    <div className="card-body pt-1">
                        <p className="mt-1">
                            <strong>@{post.author.username}</strong>{" "}
                            {post.caption}
                        </p>
                    </div>
                )}

                {/* ACTIONS */}
                <div className="card-body py-2">
                    <div className="post-actions d-flex justify-content-around align-items-center">
                        <button
                            className="action-btn"
                            onClick={async () => {
                                try {
                                    await toggleLike(post._id);

                                    setPost(prev => ({
                                        ...prev,
                                        likes: prev.likes.includes(user._id)
                                            ? prev.likes.filter(id => id !== user._id)
                                            : [...prev.likes, user._id],
                                    }));
                                } catch {
                                    showToast("Failed to like post", "error");
                                }
                            }}
                        >
                            <i className={`bi ${isLiked ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
                            <span>{post.likes.length}</span>
                        </button>

                        <button
                            className="action-btn"
                            onClick={() => setActiveCommentPost(post)}
                        >
                            <i className="bi bi-chat"></i>
                            <span>{post.comments.length}</span>
                        </button>

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

            {activeCommentPost && (
                <CommentPanel
                    post={activeCommentPost}
                    onClose={() => setActiveCommentPost(null)}
                    onUpdate={(payload, type) => {
                        setPost(prev => ({
                            ...prev,
                            comments:
                                type === "add"
                                    ? [...prev.comments, payload]
                                    : prev.comments.filter(c => c._id !== payload),
                        }));
                    }}
                />
            )}

            {showShare && (
                <SharePostModal
                    postId={sharePostId}
                    onClose={() => setShowShare(false)}
                />
            )}
        </div>
    );
}

export default SinglePost;