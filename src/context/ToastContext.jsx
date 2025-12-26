import { createContext, useState } from "react";

export const ToastContext = createContext();

function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {toast && (
                <div
                    className="toast show position-fixed bottom-0 end-0 m-3"
                    style={{ zIndex: 9999 }}
                >
                    <div className={`toast-header text-${toast.type}`}>
                        <strong className="me-auto">
                            {toast.type === "error" ? "Error" : "Success"}
                        </strong>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setToast(null)}
                        />
                    </div>
                    <div className="toast-body">{toast.message}</div>
                </div>
            )}
        </ToastContext.Provider>
    );
}

export default ToastProvider;