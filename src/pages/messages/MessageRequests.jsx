import { useEffect, useState } from "react";
import {
    fetchMessageRequests,
    acceptMessageRequest,
    rejectMessageRequest,
} from "../../api/messages";
import PageHeader from "../../components/comments/PageHeader";
import "./MessageRequests.css";

function MessageRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshRequests = async () => {
        const data = await fetchMessageRequests();
        setRequests(data?.requests || []);
    };

    useEffect(() => {
        let isMounted = true;
        fetchMessageRequests().then((data) => {
            if (isMounted) {
                setRequests(data?.requests || []);
                setLoading(false);
            }
        });
        return () => { isMounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="container mt-4" style={{ maxWidth: "500px" }}>
                <div className="glass-card p-5 text-center">
                    <div className="spinner-border text-warning mb-2" role="status"></div>
                    <p className="text-muted mb-0">Loading requests…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "500px" }}>
            <PageHeader title="Back to Messages" backTo="/messages" />

            <div className="d-flex align-items-center gap-2 mb-4">
                <h4 className="mb-0 fw-bold">Message Requests</h4>
                {requests.length > 0 && (
                    <span className="badge rounded-pill" style={{ background: "var(--primary-gradient)", fontSize: "12px" }}>
                        {requests.length}
                    </span>
                )}
            </div>

            {requests.length === 0 && (
                <div className="glass-card p-5 text-center">
                    <i className="bi bi-inbox text-muted mb-3 d-block" style={{ fontSize: "2.5rem" }}></i>
                    <h6 className="fw-semibold mb-1">No message requests</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                        When someone new messages you, it will appear here.
                    </p>
                </div>
            )}

            <div className="message-request-list">
                {requests.map((c) => {
                    const sender = c.participants.find(
                        (p) => p._id === c.requestedBy
                    );

                    return (
                        <div key={c._id} className="message-request-item">
                            {/* Avatar */}
                            <img
                                src={sender?.profileImage?.url || "/default-avatar.svg"}
                                alt="avatar"
                                className="request-avatar"
                                onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.svg"; }}
                            />

                            {/* Username */}
                            <div className="request-info">
                                <strong>@{sender?.username}</strong>
                                <small className="text-muted d-block">wants to message you</small>
                            </div>

                            {/* Actions */}
                            <div className="request-actions">
                                <button
                                    className="btn-accept"
                                    onClick={async () => {
                                        await acceptMessageRequest(c._id);
                                        refreshRequests();
                                    }}
                                >
                                    <i className="bi bi-check-lg me-1"></i>Accept
                                </button>
                                <button
                                    className="btn-reject"
                                    onClick={async () => {
                                        await rejectMessageRequest(c._id);
                                        refreshRequests();
                                    }}
                                >
                                    <i className="bi bi-x-lg me-1"></i>Decline
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MessageRequests;