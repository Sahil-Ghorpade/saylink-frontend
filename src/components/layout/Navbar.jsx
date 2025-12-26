import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NotificationContext } from "../../context/NotificationContext";
import "./Navbar.css";

function Navbar() {
    const { isAuthenticated, user } = useContext(AuthContext);
    const { unreadCount } = useContext(NotificationContext);

    if (!isAuthenticated) return null;

    return (
        <nav className="app-navbar">
            <div className="nav-inner">

                {/* LEFT — BRAND / HOME */}
                <Link className="nav-brand" to="/feed">
                    <img
                        src="/logo/saylink-icon.png"
                        alt="Saylink"
                        className="nav-logo-icon"
                    />
                    <span className="nav-logo-text">Saylink</span>
                </Link>

                {/* RIGHT — ACTIONS */}
                <div className="nav-actions">

                    {/* SEARCH */}
                    <Link className="nav-icon" to="/search" title="Search">
                        <i className="bi bi-search"></i>
                    </Link>

                    {/* CREATE */}
                    <Link className="nav-icon create" to="/create" title="Create Post">
                        <i className="bi bi-plus-square"></i>
                    </Link>

                    {/* MESSAGES */}
                    <Link className="nav-icon" to="/messages" title="Messages">
                        <i className="bi bi-chat-dots"></i>
                    </Link>

                    {/* NOTIFICATIONS */}
                    <Link className="nav-icon notification" to="/notifications" title="Notifications">
                        <i className="bi bi-bell"></i>

                        {unreadCount > 0 && (
                            <span className="badge">
                                {unreadCount}
                            </span>
                        )}
                    </Link>

                    {/* PROFILE */}
                    <Link
                        className="nav-avatar"
                        to={`/profile/${user.username}`}
                        title="Profile"
                    >
                        <img
                            src={user.profileImage?.url || "/default-avatar.png"}
                            alt="profile"
                        />
                    </Link>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;