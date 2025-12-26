import { useNavigate } from "react-router-dom";
import CreatePost from "../../components/posts/CreatePost";
import { ToastContext } from "../../context/ToastContext";
import { useContext } from "react";

function CreatePostPage() {
    const navigate = useNavigate();
    const { showToast } = useContext(ToastContext);

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            {/* HEADER */}
            <div className="d-flex align-items-center mb-3">
                <button
                    className="btn btn-light me-2"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>
                <h5 className="mb-0">Create Post</h5>
            </div>

            {/* CREATE POST */}
            <CreatePost
                onPostCreated={() => {
                    showToast("Post created successfully", "success");
                    navigate("/feed");
                }}
            />
        </div>
    );
}

export default CreatePostPage;