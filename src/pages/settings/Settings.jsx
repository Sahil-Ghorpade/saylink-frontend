import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateSettings } from "../../api/user";
import { ToastContext } from "../../context/ToastContext";
import PageHeader from "../../components/comments/PageHeader";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings() {
    const { user, updateUser } = useContext(AuthContext);
    const [username, setUsername] = useState(user.username || "");
    const [bio, setBio] = useState(user.bio || "");
    const [isPrivate, setIsPrivate] = useState(user.isPrivate || false);
    const [name, setName] = useState(user.name || "");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("username", username);
        formData.append("bio", bio);
        formData.append("isPrivate", isPrivate);
        if (image) formData.append("profileImage", image);

        try {
            setLoading(true);
            const data = await updateSettings(formData);
            updateUser(data.user);
            showToast("Profile updated! ✨", "success");
            navigate(`/profile/${data.user.username}`);
        } catch (err) {
            showToast(err.message || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    const isUnchanged =
        username === user.username &&
        name === user.name &&
        bio === user.bio &&
        isPrivate === user.isPrivate &&
        !image;

    useEffect(() => {
        setUsername(user.username || "");
        setName(user.name || "");
        setBio(user.bio || "");
        setIsPrivate(user.isPrivate || false);
    }, [user]);

    const avatarSrc = image ? URL.createObjectURL(image) : (user.profileImage?.url || "/default-avatar.svg");

    return (
        <div className="container mt-4" style={{ maxWidth: "520px" }}>
            <PageHeader title="Back to profile" />

            <h4 className="mb-4 fw-bold">Edit Profile</h4>

            <form onSubmit={handleSubmit}>

                {/* — AVATAR SECTION — */}
                <div className="settings-section mb-4">
                    <div className="settings-avatar-row">
                        <img
                            src={avatarSrc}
                            alt="profile preview"
                            className="settings-avatar"
                            onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.svg"; }}
                        />
                        <div>
                            <p className="mb-1 fw-semibold" style={{ fontSize: "15px" }}>
                                {user.name || user.username}
                            </p>
                            <button
                                type="button"
                                className="btn-change-photo"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <i className="bi bi-camera me-1"></i>
                                {image ? "Change again" : "Change photo"}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            {image && (
                                <span className="text-muted ms-2" style={{ fontSize: "12px" }}>
                                    {image.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* — PROFILE INFO — */}
                <div className="settings-section mb-3">
                    <h6 className="settings-section-title">Profile Info</h6>

                    <div className="settings-field mb-3">
                        <label className="settings-label">Name</label>
                        <input
                            type="text"
                            className="settings-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your display name"
                        />
                    </div>

                    <div className="settings-field mb-3">
                        <label className="settings-label">Username</label>
                        <input
                            type="text"
                            className="settings-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                            placeholder="Username"
                        />
                        {username !== user.username && (
                            <small className="settings-hint warn">
                                <i className="bi bi-exclamation-triangle me-1"></i>
                                Changing username will update your profile URL
                            </small>
                        )}
                    </div>

                    <div className="settings-field">
                        <label className="settings-label d-flex justify-content-between">
                            <span>Bio</span>
                            <span className="text-muted">{bio.length}/150</span>
                        </label>
                        <textarea
                            className="settings-input"
                            maxLength={150}
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Write something about yourself…"
                        />
                    </div>
                </div>

                {/* — PRIVACY — */}
                <div className="settings-section mb-4">
                    <h6 className="settings-section-title">Privacy</h6>

                    <div className="settings-toggle-row">
                        <div>
                            <p className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>Private Account</p>
                            <small className="text-muted">Only approved followers can see your posts</small>
                        </div>
                        <div className="form-check form-switch mb-0">
                            <input
                                className="form-check-input settings-switch"
                                type="checkbox"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                            />
                        </div>
                    </div>
                </div>

                {/* — SAVE — */}
                <button
                    type="submit"
                    className="gradient-btn w-100 py-2"
                    disabled={loading || isUnchanged}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Saving…
                        </>
                    ) : (
                        <>
                            <i className="bi bi-check-lg me-2"></i>Save Changes
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default Settings;