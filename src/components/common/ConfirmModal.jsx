import "./ConfirmModal.css";

/**
 * In-app confirm dialog — replaces window.confirm()
 * Props: message, confirmLabel, onConfirm, onCancel, danger (bool)
 */
function ConfirmModal({ message, confirmLabel = "Confirm", onConfirm, onCancel, danger = true }) {
    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <button className="confirm-cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        className={`confirm-ok-btn ${danger ? "danger" : ""}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
