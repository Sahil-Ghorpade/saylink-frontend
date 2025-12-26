import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateSettings } from "../../api/user";
import { ToastContext } from "../../context/ToastContext";
import PageHeader from "../../components/comments/PageHeader";
import { useNavigate } from "react-router-dom";

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

    const handleSubmit = async (e) => {
        e.preventDefault();
            if (username.trim() === user.username) {
        showToast("Username unchanged", "info");
    }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("username", username);
        formData.append("bio", bio);
        formData.append("isPrivate", isPrivate);

        if (image) {
            formData.append("profileImage", image);
        }

        try {
            setLoading(true);
            const data = await updateSettings(formData);

            updateUser(data.user);
            showToast("Settings updated successfully", "success");

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


    return (
        <div className="container mt-4" style={{ maxWidth: "500px" }}>
            <PageHeader title="Back to profile" />

            <h4 className="mb-4">Settings</h4>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}    
                        onChange={(e) =>
                                setUsername(e.target.value.replace(/\s/g, ""))
                            }
                        placeholder="Username"
                    />
                    {username !== user.username && (
                        <small className="text-warning">
                            Changing username will update your profile URL
                        </small>
                    )}
                    {username === user.username && (
                        <small className="text-muted">
                            Current username
                        </small>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label d-flex justify-content-between">
                        <span>Bio</span>
                        <small className="text-muted">{bio.length}/150</small>
                    </label>
                    <textarea
                        className="form-control"
                        maxLength={150}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                <div className="border rounded p-3 mb-3">
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                        />
                        <label className="form-check-label fw-semibold">
                            Private Account
                        </label>
                    </div>
                    <small className="text-muted">
                        Only approved followers can see your posts
                    </small>
                </div>

                <div className="mb-3">
                    <img
                        src={image ? URL.createObjectURL(image) : user.profileImage?.url}
                        alt="profile preview"
                        className="rounded-circle mb-2"
                        width="90"
                        height="90"
                        style={{ objectFit: "cover" }}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Profile Photo</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <button className="btn btn-warning w-100" disabled={loading || isUnchanged}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

export default Settings;