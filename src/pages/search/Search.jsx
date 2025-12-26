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
        }, 400);

        return () => clearTimeout(delay);
    }, [query]);

    return (
        <div className="container mt-4" style={{ maxWidth: "500px" }}>
            <h4 className="mb-3">Search Users</h4>

            <input
                className="form-control mb-3"
                placeholder="Search by username"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
            />

            {loading && <p className="text-muted">Searching…</p>}

            {results.map((user) => (
                <Link
                    key={user._id}
                    to={`/profile/${user.username}`}
                    className="d-flex align-items-center mb-2 text-decoration-none"
                >
                    <img
                        src={user.profileImage?.url || "/default-avatar.png"}
                        alt="profile"
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                    />
                    <span className="text-dark fw-medium">
                        @{user.username}
                    </span>
                </Link>
            ))}

            {results.length === 0 && query && !loading && (
                <p className="text-muted">No users found.</p>
            )}
        </div>
    );
}

export default Search;