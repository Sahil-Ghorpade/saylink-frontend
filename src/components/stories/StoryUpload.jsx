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
            <div className="story-upload-modal">
                <h5>Create Story</h5>

                <input
                    type="file"
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
                {error && (
                    <p className="text-danger small mt-2">
                        {error}
                    </p>
                )}

                {previewUrl && (
                    <div className="mt-3">
                        {file.type.startsWith("image/") ? (
                            <img
                                src={previewUrl}
                                alt="Story preview"
                                className="img-fluid rounded"
                            />
                        ) : (
                            <video
                                src={previewUrl}
                                className="w-100 rounded"
                                muted
                                loop
                                autoPlay
                            />
                        )}
                    </div>
                )}

                <div className="mt-3 d-flex gap-2">
                    <button
                        className="btn btn-secondary btn-sm"
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
                        className="btn btn-primary btn-sm"
                        disabled={!file || error || uploading}
                        onClick={async () => {
                            try {
                                setUploading(true);
                                await uploadStory(file);

                                if (previewUrl) {
                                    URL.revokeObjectURL(previewUrl);
                                }

                                onUploaded();   // refresh feed + stories
                                onClose();      // close modal
                            } catch (err) {
                                console.error("Story upload error:", err);
                                setError(
                                    err?.response?.data?.message ||
                                    err.message ||
                                    "Failed to upload story"
                                )
                            } finally {
                                setUploading(false);
                            }
                        }}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StoryUpload;