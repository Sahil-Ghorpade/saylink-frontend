import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NotificationContext } from "../../context/NotificationContext";
import { ThemeContext } from "../../context/ThemeContext";
import "./Navbar.css";

function Navbar() {
    const { isAuthenticated, user } = useContext(AuthContext);
    const { unreadCount } = useContext(NotificationContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    if (!isAuthenticated) return null;

    return (
        <nav className="app-navbar">
            <div className="nav-inner">

                {/* LEFT — BRAND / HOME */}
                <Link className="nav-brand" to="/feed">
                    <img
                        src="/logo/saylink-icon.png"
                        alt="SayLink"
                        className="nav-logo-icon"
                    />
                    <span className="nav-logo-text gradient-text">SayLink</span>
                </Link>

                {/* RIGHT — ACTIONS */}
                <div className="nav-actions">

                    {/* SEARCH */}
                    <Link className="nav-icon" to="/search" title="Search">
                        <i className="bi bi-search"></i>
                    </Link>

                    {/* CREATE */}
                    <Link className="nav-icon create" to="/create" title="Create Post">
                        <i className="bi bi-plus-circle-fill"></i>
                    </Link>

                    {/* MESSAGES */}
                    <Link className="nav-icon" to="/messages" title="Messages">
                        <i className="bi bi-chat-dots-fill"></i>
                    </Link>

                    {/* THEME TOGGLE */}
                    <button 
                        className="nav-icon theme-toggle-btn" 
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <i className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill'}`}></i>
                    </button>

                    {/* NOTIFICATIONS */}
                    <Link className="nav-icon notification" to="/notifications" title="Notifications">
                        <i className="bi bi-bell-fill"></i>

                        {unreadCount > 0 && (
                            <span className="badge badge-glow">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </Link>

                    {/* PROFILE */}
                    <Link
                        className="nav-avatar"
                        to={`/profile/${user.username}`}
                        title="Profile"
                    >
                        <div className="avatar-ring">
                            <img
                                src={user.profileImage?.url || "/default-avatar.svg"}
                                alt="profile"
                                onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.svg"; }}
                            />
                        </div>
                    </Link>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;