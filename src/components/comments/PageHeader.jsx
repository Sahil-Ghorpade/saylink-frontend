import { useNavigate } from "react-router-dom";
import "./PageHeader.css";

function PageHeader({ title, backTo }) {
    const navigate = useNavigate();

    return (
        <div className="page-header">
            <button
                className="page-header-back"
                onClick={() => {
                    if (backTo) navigate(backTo);
                    else navigate(-1);
                }}
                aria-label="Go back"
            >
                <i className="bi bi-arrow-left"></i>
            </button>
            <span className="page-header-title">{title}</span>
        </div>
    );
}

export default PageHeader;