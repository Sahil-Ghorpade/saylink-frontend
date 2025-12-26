import { useEffect, useState } from "react";
import {
    fetchMessageRequests,
    acceptMessageRequest,
    rejectMessageRequest,
} from "../../api/messages";
import "./MessageRequests.css";

function MessageRequests() {
    const [requests, setRequests] = useState([]);

    const loadRequests = async () => {
        const data = await fetchMessageRequests();
        setRequests(data.requests || []);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    return (
        <div className="container mt-4" style={{ maxWidth: "500px" }}>
            <h4 className="mb-3">Message Requests</h4>

            {requests.length === 0 && (
                <p className="text-muted text-center">
                    No new message requests
                </p>
            )}

            <div className="message-request-list">
                {requests.map((c) => {
                    const sender = c.participants.find(
                        (p) => p._id !== c.requestedBy
                    );

                    return (
                        <div key={c._id} className="message-request-item">
                            {/* Avatar */}
                            <img
                                src={
                                    sender?.profileImage?.url ||
                                    "/default-avatar.png"
                                }
                                alt="avatar"
                                className="request-avatar"
                            />

                            {/* Username */}
                            <div className="request-info">
                                <strong>@{sender?.username}</strong>
                                <small className="text-muted">
                                    wants to message you
                                </small>
                            </div>

                            {/* Actions */}
                            <div className="request-actions">
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={async () => {
                                        await acceptMessageRequest(c._id);
                                        loadRequests();
                                    }}
                                >
                                    Accept
                                </button>

                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={async () => {
                                        await rejectMessageRequest(c._id);
                                        loadRequests();
                                    }}
                                >
                                    Reject
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