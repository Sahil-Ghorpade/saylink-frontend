import { useNavigate } from "react-router-dom";

function PostPreview({ post }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/post/${post._id}`)}
            style={{
                cursor: "pointer",
                border: "1px solid #ddd",
                borderRadius: 8,
                overflow: "hidden",
            }}
        >
            {/* MEDIA */}
            {post.image?.url && (
                <img
                    src={post.image.url}
                    alt="post"
                    style={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                    }}
                />
            )}

            {/* CAPTION */}
            <div style={{ padding: 8 }}>
                <strong>@{post.author.username}</strong>
                <p className="mb-0 text-muted" style={{ fontSize: 14 }}>
                    {post.caption?.slice(0, 80)}
                    {post.caption?.length > 80 && "..."}
                </p>
            </div>
        </div>
    );
}

export default PostPreview;