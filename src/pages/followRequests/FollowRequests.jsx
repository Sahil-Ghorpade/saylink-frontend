import { useEffect, useState } from "react";
import {
    fetchFollowRequests,
    acceptFollowRequest,
    rejectFollowRequest,
} from "../../api/followRequests";
import { Link } from "react-router-dom";
import "./FollowRequests.css";

function FollowRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadRequests = async () => {
        try {
            const data = await fetchFollowRequests();
            setRequests(data.requests || []);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    if (loading) {
        return (
            <div className="container mt-5 text-center" style={{ maxWidth: "500px" }}>
                <div className="spinner-border text-warning" role="status"></div>
                <p className="mt-2 text-muted">Loading follow requests…</p>
            </div>
        );
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "520px" }}>
            <h4 className="mb-4 fw-bold">Follow Requests</h4>

            {requests.length === 0 && (
                <div className="glass-card p-5 text-center">
                    <i className="bi bi-person-check text-muted fs-1 mb-2 d-block"></i>
                    <p className="text-muted mb-0">No follow requests right now</p>
                </div>
            )}

            <div className="follow-request-list">
                {requests.map((user) => (
                    <div key={user._id} className="follow-request-item">
                        <Link
                            to={`/profile/${user.username}`}
                            className="request-user"
                        >
                            <img
                                src={
                                    user.profileImage?.url ||
                                    "/default-avatar.svg"
                                }
                                alt="avatar"
                                className="request-avatar"
                                onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.svg"; }}
                            />
                            <div>
                                <span className="d-block fw-bold text-light">@{user.username}</span>
                                <small className="text-muted">{user.name || "User"}</small>
                            </div>
                        </Link>

                        {/* Actions */}
                        <div className="request-actions">
                            <button
                                className="btn-accept"
                                onClick={async () => {
                                    await acceptFollowRequest(user._id);
                                    loadRequests();
                                }}
                            >
                                Confirm
                            </button>

                            <button
                                className="btn-reject"
                                onClick={async () => {
                                    await rejectFollowRequest(user._id);
                                    loadRequests();
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FollowRequests;
