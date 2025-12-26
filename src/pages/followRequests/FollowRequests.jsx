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
            <p className="text-center mt-4 text-muted">
                Loading follow requests…
            </p>
        );
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "500px" }}>
            <h4 className="mb-4">Follow Requests</h4>

            {requests.length === 0 && (
                <p className="text-muted text-center">
                    No follow requests right now
                </p>
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
                                    "/default-avatar.png"
                                }
                                alt="avatar"
                                className="request-avatar"
                            />
                            <span>@{user.username}</span>
                        </Link>

                        {/* Actions */}
                        <div className="request-actions">
                            <button
                                className="btn btn-sm btn-success"
                                onClick={async () => {
                                    await acceptFollowRequest(user._id);
                                    loadRequests();
                                }}
                            >
                                Accept
                            </button>

                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={async () => {
                                    await rejectFollowRequest(user._id);
                                    loadRequests();
                                }}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FollowRequests;
