import { useNavigate } from "react-router-dom";
import CreatePost from "../../components/posts/CreatePost";
import { ToastContext } from "../../context/ToastContext";
import { useContext } from "react";

function CreatePostPage() {
    const navigate = useNavigate();
    const { showToast } = useContext(ToastContext);

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <div className="glass-card p-4">
                {/* HEADER */}
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-glass">
                    <button
                        className="btn btn-outline-light btn-sm rounded-circle me-3"
                        onClick={() => navigate(-1)}
                        style={{ width: "36px", height: "36px" }}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </button>
                    <h5 className="mb-0 fw-bold">Create New Post</h5>
                </div>

                {/* CREATE POST FORM */}
                <CreatePost
                    onPostCreated={() => {
                        showToast("Post published successfully!", "success");
                        navigate("/feed");
                    }}
                />
            </div>
        </div>
    );
}

export default CreatePostPage;