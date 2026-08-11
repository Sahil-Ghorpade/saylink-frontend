import { Link, useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-card glass-card">
                <div className="not-found-badge">404</div>
                <div className="not-found-icon">
                    <i className="bi bi-compass"></i>
                </div>
                <h2 className="not-found-title">Page Not Found</h2>
                <p className="not-found-desc">
                    Oops! The page you're looking for doesn't exist, was removed, or has a broken link.
                </p>
                <div className="not-found-actions">
                    <button className="btn btn-outline-light rounded-pill px-4" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left me-2"></i>Go Back
                    </button>
                    <Link to="/feed" className="gradient-btn px-4 text-decoration-none d-inline-flex align-items-center">
                        <i className="bi bi-house-door me-2"></i>Back to Feed
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
