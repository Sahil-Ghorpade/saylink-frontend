import { useState, useContext } from "react";
import { createPost } from "../../api/posts";
import { ToastContext } from "../../context/ToastContext";

function CreatePost({ onPostCreated }) {
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const { showToast } = useContext(ToastContext);

    const handleFileSelect = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            showToast("Please select a valid image file", "error");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            showToast("Image must be under 10MB", "error");
            return;
        }
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            showToast("Please add an image to post", "error");
            return;
        }

        const formData = new FormData();
        formData.append("caption", caption);
        if (image) formData.append("image", image);

        try {
            setLoading(true);
            await createPost(formData);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setCaption("");
            setImage(null);
            setPreviewUrl(null);
            onPostCreated();
        } catch (error) {
            showToast(error.message || "Failed to create post", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            {/* CAPTION TEXTAREA */}
            <div className="mb-3">
                <textarea
                    className="form-control"
                    placeholder="Write a caption..."
                    rows="3"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
            </div>

            {/* DROPZONE / IMAGE PREVIEW */}
            {!previewUrl ? (
                <label className="story-dropzone mb-3 d-block cursor-pointer">
                    <i className="bi bi-image text-warning fs-1 mb-2 d-block"></i>
                    <span className="fw-semibold d-block text-light">Click to upload photo</span>
                    <small className="text-muted">JPEG, PNG or WEBP up to 10MB</small>
                    <input
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                    />
                </label>
            ) : (
                <div className="position-relative mb-3 rounded overflow-hidden border border-glass" style={{ maxHeight: "360px" }}>
                    <img
                        src={previewUrl}
                        alt="preview"
                        className="w-100 h-100 object-fit-contain bg-black"
                        style={{ maxHeight: "360px" }}
                    />
                    <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
                        onClick={() => {
                            if (previewUrl) URL.revokeObjectURL(previewUrl);
                            setImage(null);
                            setPreviewUrl(null);
                        }}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}

            {/* ACTION BUTTON */}
            <div className="d-flex justify-content-end">
                <button
                    type="submit"
                    className="gradient-btn px-4"
                    disabled={loading || !image}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Posting…
                        </>
                    ) : (
                        <>
                            <i className="bi bi-send-fill me-1"></i>
                            Share Post
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

export default CreatePost;