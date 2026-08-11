import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProfile } from "../../api/profile";
import { AuthContext } from "../../context/AuthContext";
import { toggleFollow } from "../../api/follow";
import { startConversation } from "../../api/messages";
import { ToastContext } from "../../context/ToastContext";
import { fetchUserStories } from "../../api/stories";
import StoryViewer from "../../components/stories/StoryViewer";
import { SocketContext } from "../../context/SocketContext";
import PageHeader from "../../components/comments/PageHeader";
import './Profile.css'

function Profile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useContext(AuthContext);
    const [isFollowing, setIsFollowing] = useState(false);
    const [relationship, setRelationship] = useState(null);
    const { showToast } = useContext(ToastContext);
    const [hasActiveStory, setHasActiveStory] = useState(false);
    const [activeStoryGroup, setActiveStoryGroup] = useState(null);
    const [hasUnseenStory, setHasUnseenStory] = useState(false);
    const currentUserId = user?._id;
    const [openMenu, setOpenMenu] = useState(false);

    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            try {
                const data = await fetchProfile(username);
                setProfile(data.user);
                setPosts(data.posts);
                setIsFollowing(data.relationship.isFollower);
                setRelationship(data.relationship);
                setHasActiveStory(data.hasActiveStory);
                setHasUnseenStory(data.hasUnseenStory);
            } catch (error) {
                console.error(error.message);
            } finally { 
                setLoading(false);
            }
        };

        loadProfile();
    }, [username]);

    useEffect(() => {
        if (!socket) return;

        socket.on("story_viewed", ({ storyId, viewer }) => {
            setActiveStoryGroup((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    stories: prev.stories.map((s) =>
                        s._id === storyId
                            ? {
                                ...s,
                                viewers: [...(s.viewers || []), viewer],
                            }
                            : s
                    ),
                };
            });
        });

        return () => socket.off("story_viewed");
    }, [socket]);

    useEffect(() => {
        const closeMenu = () => setOpenMenu(false);
        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);

    const handleMessage = async () => {
        try {
            const res = await startConversation(profile._id);

            // Direct chat
            if (res.conversation?.isAccepted) {
                navigate(`/messages/${res.conversation._id}`);
                return;
            }

            showToast("Message request sent");
        } catch (err) {
            showToast(err.message || "Unable to start conversation", "error");
        }
    };
    
    if (loading) {
        return (
            <div className="container mt-5" style={{ maxWidth: "600px" }}>
                <div className="glass-card p-5 text-center">
                    <div className="spinner-border text-warning mb-3" role="status"></div>
                    <p className="text-muted mb-0">Loading profile…</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mt-5" style={{ maxWidth: "600px" }}>
                <div className="glass-card p-5 text-center">
                    <i className="bi bi-person-x text-muted mb-3 d-block" style={{ fontSize: "2.5rem" }}></i>
                    <h6 className="fw-semibold mb-1">User not found</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>This account may have been deleted or never existed.</p>
                </div>
            </div>
        );
    }

    const handleProfileStoryViewed = (storyId) => {
        setActiveStoryGroup((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                stories: prev.stories.map((s) =>
                    s._id === storyId
                        ? {
                            ...s,
                            viewers: [...(s.viewers || []), currentUserId],
                        }
                        : s
                ),
            };
        });
    };

    const isOwner = currentUserId === profile._id;

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <div className="profile-header">

                <div className="profile-header-top">
                    <PageHeader title="Back" />

                    {isOwner && (
                        <div className="menu-wrapper">
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
                                        onClick={() => {
                                            if (!window.confirm("Logout from Saylink?")) return;
                                            logout();
                                            navigate("/login");
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* PART 1 — Avatar + Name + Stats */}
                <div className="profile-main">
                    <div
                       className={`profile-avatar ${
                            hasActiveStory
                                ? hasUnseenStory
                                    ? "has-story unseen"
                                    : "has-story seen"
                                : ""
                        }`}
                        style={{cursor:hasActiveStory ? "pointer" : "default"}}
                        onClick={async () => {
                            if (!hasActiveStory) return;
                            const data = await fetchUserStories(profile._id);
                            setActiveStoryGroup({
                                user: profile,
                                stories: data.stories,
                            });
                        }}
                    >
                        <img
                            src={profile.profileImage?.url || "/default-avatar.svg"}
                            alt="profile"
                            onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.svg"; }}
                        />
                    </div>

                    <div className="profile-info">
                        <h5>{profile.name || profile.username}</h5>

                        <div className="profile-stats">
                            <span><strong>{posts.length}</strong> posts</span>
                            <span><strong>{profile.followers.length}</strong> followers</span>
                            <span><strong>{profile.following.length}</strong> following</span>
                        </div>
                    </div>
                </div>

                {/* PART 2 — Username + Bio */}
                <div className="profile-bio">
                    <strong>@{profile.username}</strong>
                    {profile.bio && <p>{profile.bio}</p>}
                </div>

                {/* PART 3 — ACTION BUTTONS */}
                <div className="profile-actions d-flex gap-2 mt-3">
                    {currentUserId === profile._id ? (
                        <>
                            <button
                                className="btn btn-outline-light btn-sm rounded-pill px-3"
                                onClick={() => navigate("/settings")}
                            >
                                <i className="bi bi-gear me-1"></i> Edit Profile
                            </button>
                            <button
                                className="gradient-btn btn-sm px-4"
                                onClick={() => navigate("/create")}
                            >
                                <i className="bi bi-plus-lg me-1"></i> New Post
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={isFollowing ? "btn btn-outline-light btn-sm rounded-pill px-4" : "gradient-btn btn-sm px-4"}
                                onClick={async () => {
                                    try {
                                        const res = await toggleFollow(profile._id);
                                        if (res.requested) {
                                            showToast("Follow request sent");
                                            setIsFollowing(false);
                                        } else {
                                            setIsFollowing(res.following);
                                        }
                                    } catch (err) {
                                        showToast(err.message || "Action failed", "error");
                                    }
                                }}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </button>

                            <button
                                className="btn btn-outline-light btn-sm rounded-pill px-3"
                                onClick={handleMessage}
                            >
                                <i className="bi bi-chat-dots me-1"></i> Message
                            </button>
                        </>
                    )}
                </div>

            </div>

            <div className="d-flex align-items-center justify-content-between mb-3 mt-2">
                <h6 className="mb-0 fw-bold" style={{ letterSpacing: "0.02em" }}>
                    <i className="bi bi-grid-3x3 me-2 text-muted"></i>Posts
                </h6>
                <span className="text-muted" style={{ fontSize: "13px" }}>{posts.length}</span>
            </div>

            <div className="profile-posts">
                {posts.length === 0 && !profile.isPrivate && (
                    <div className="glass-card p-5 text-center">
                        <i className="bi bi-images text-muted mb-3 d-block" style={{ fontSize: "2rem" }}></i>
                        <p className="text-muted mb-0" style={{ fontSize: "13px" }}>No posts yet</p>
                    </div>
                )}

                {profile.isPrivate && !relationship?.isFollower && currentUserId !== profile._id ? (
                    <div className="private-account-box">
                        <h6>This account is private</h6>
                        <p>Follow this account to see their photos and videos.</p>
                    </div>
                ) : (
                    <div className="post-grid">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="post-tile"
                                onClick={() => navigate(`/post/${post._id}`)}
                            >
                                <img
                                    src={post.image?.url}
                                    alt="post"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.svg"; }}
                                />
                                <div className="post-tile-overlay">
                                    <span><i className="bi bi-heart-fill me-1"></i>{post.likes?.length || 0}</span>
                                    <span><i className="bi bi-chat-fill me-1"></i>{post.comments?.length || 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            
            {activeStoryGroup && (
                <StoryViewer
                    storyGroup={activeStoryGroup}
                    onClose={() => setActiveStoryGroup(null)}
                    onStoryViewed={handleProfileStoryViewed}
                />
            )}

        </div>
    );
}

export default Profile;