import { useNavigate } from "react-router-dom";

function PageHeader({ title, backTo }) {
    const navigate = useNavigate();

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "#8ECAE6",
                position: "sticky",
                top: 0,
                zIndex: 10,
            }}
        >
            <button
                onClick={() => {
                    if (backTo) {
                        navigate(backTo);
                    } else {
                        navigate(-1);
                    }
                }}
                style={{
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                }}
            >
                ←
            </button>

            <h6 className="mb-0">{title}</h6>
        </div>
    );
}

export default PageHeader;