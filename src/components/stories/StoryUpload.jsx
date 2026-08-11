import { useState } from "react";
import { uploadStory } from "../../api/stories";
import './storyUpload.css';

function StoryUpload({ onClose, onUploaded }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    return (
        <div className="story-upload-overlay">
            <div className="story-upload-modal animate-fade-in">
                <h5 className="gradient-text">Create Story</h5>

                {!previewUrl ? (
                    <label className="story-dropzone">
                        <i className="bi bi-cloud-arrow-up-fill"></i>
                        <span className="fw-semibold d-block text-light">Choose photo or video</span>
                        <small className="text-muted d-block mt-1">Image up to 5MB, Video up to 15MB</small>
                        <input
                            type="file"
                            className="d-none"
                            accept="image/*,video/*"    
                            onChange={(e) => {
                                const selected = e.target.files[0];
                                if (!selected) return;

                                const isImage = selected.type.startsWith("image/");
                                const isVideo = selected.type.startsWith("video/");

                                if (!isImage && !isVideo) {
                                    setError("Only images or videos are allowed");
                                    return;
                                }

                                if (isImage && selected.size > 5 * 1024 * 1024) {
                                    setError("Image must be under 5MB");
                                    return;
                                }

                                if (isVideo && selected.size > 15 * 1024 * 1024) {
                                    setError("Video must be under 15MB");
                                    return;
                                }

                                setError("");
                                setFile(selected);
                                setPreviewUrl(URL.createObjectURL(selected));
                            }}
                        />
                    </label>
                ) : (
                    <div className="story-preview-container my-3">
                        {file.type.startsWith("image/") ? (
                            <img
                                src={previewUrl}
                                alt="Story preview"
                                className="img-fluid"
                            />
                        ) : (
                            <video
                                src={previewUrl}
                                className="w-100"
                                muted
                                loop
                                autoPlay
                            />
                        )}
                    </div>
                )}

                {error && (
                    <p className="text-danger small mt-2 text-center">
                        {error}
                    </p>
                )}

                <div className="mt-4 d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-outline-light btn-sm px-3 rounded-pill"
                        onClick={() => {
                            if (previewUrl) {
                                URL.revokeObjectURL(previewUrl);
                            }
                            onClose();
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        className="gradient-btn btn-sm px-4"
                        disabled={!file || error || uploading}
                        onClick={async () => {
                            try {
                                setUploading(true);
                                await uploadStory(file);

                                if (previewUrl) {
                                    URL.revokeObjectURL(previewUrl);
                                }

                                onUploaded();
                                onClose();
                            } catch (err) {
                                console.error("Story upload error:", err);
                                setError(
                                    err?.response?.data?.message ||
                                    err.message ||
                                    "Failed to upload story"
                                );
                            } finally {
                                setUploading(false);
                            }
                        }}
                    >
                        {uploading ? "Uploading…" : "Share Story"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StoryUpload;