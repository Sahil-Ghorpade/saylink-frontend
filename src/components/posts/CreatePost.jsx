import { useState } from "react";
import { createPost } from "../../api/posts";

function CreatePost({ onPostCreated }) {
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

    if (!image) {
        alert("Please add an image to post");
        return;
    }

        const formData = new FormData();
        formData.append("caption", caption);
        if (image) formData.append("image", image);

        try {
            setLoading(true);
            await createPost(formData);
            setCaption("");
            setImage(null);
            onPostCreated();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
<form onSubmit={handleSubmit} className="mb-4">
    <textarea
        className="form-control mb-2"
        placeholder="What's on your mind?"
        rows="3"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
    />

    <input
        type="file"
        accept="image/*"
        className="form-control mb-2"
        onChange={(e) => setImage(e.target.files[0])}
    />

    {image && (
        <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="img-fluid rounded mb-2"
            style={{ maxHeight: "300px", objectFit: "cover" }}
        />
    )}

    <br />

    <button className="btn btn-warning" disabled={loading || !image}>
        {loading ? "Posting..." : "Post"}
    </button>
</form>
    );
}

export default CreatePost;