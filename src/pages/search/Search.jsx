import { useState, useEffect } from "react";
import { searchUsers } from "../../api/user";
import { Link } from "react-router-dom";

function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await searchUsers(query);
                setResults(data.users || []);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        }, 350);

        return () => clearTimeout(delay);
    }, [query]);

    return (
        <div className="container mt-4" style={{ maxWidth: "520px" }}>
            <h4 className="mb-4 fw-bold">Search People</h4>

            {/* SEARCH INPUT BAR */}
            <div className="position-relative mb-4">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input
                    className="form-control ps-5 rounded-pill"
                    placeholder="Search by username or name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
                {query && (
                    <button
                        className="btn btn-sm text-muted position-absolute top-50 end-0 translate-middle-y me-2"
                        onClick={() => setQuery("")}
                    >
                        <i className="bi bi-x-circle-fill"></i>
                    </button>
                )}
            </div>

            {/* LOADING STATE */}
            {loading && (
                <div className="text-center py-4">
                    <div className="spinner-border text-warning spinner-border-sm me-2" role="status"></div>
                    <span className="text-muted">Searching users…</span>
                </div>
            )}

            {/* RESULTS LIST */}
            <div className="d-flex flex-column gap-2">
                {results.map((user) => (
                    <Link
                        key={user._id}
                        to={`/profile/${user.username}`}
                        className="glass-card p-3 d-flex align-items-center justify-content-between text-decoration-none"
                    >
                        <div className="d-flex align-items-center gap-3">
                            <img
                                src={user.profileImage?.url || "/default-avatar.svg"}
                                alt="profile"
                                className="rounded-circle border border-glass"
                                width="46"
                                height="46"
                                style={{ objectFit: "cover" }}
                                onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.svg"; }}
                            />
                            <div>
                                <span className="fw-bold text-light d-block">
                                    @{user.username}
                                </span>
                                <small className="text-muted">{user.name || "SayLink User"}</small>
                            </div>
                        </div>

                        <span className="btn btn-sm btn-outline-light rounded-pill px-3 fs-7">
                            View
                        </span>
                    </Link>
                ))}
            </div>

            {/* EMPTY STATE */}
            {results.length === 0 && query && !loading && (
                <div className="glass-card p-5 text-center">
                    <i className="bi bi-person-x text-muted fs-1 mb-2 d-block"></i>
                    <p className="text-muted mb-0">No users found for "{query}"</p>
                </div>
            )}
        </div>
    );
}

export default Search;