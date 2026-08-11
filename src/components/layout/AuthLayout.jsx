

function AuthLayout({ title, children }) {
    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 px-3 py-5">
            <div 
                className="glass-card p-4 p-md-5 w-100 animate-fade-in" 
                style={{ maxWidth: "440px" }}
            >
                <div className="text-center mb-4">
                    <div style={{ 
                        width: "56px", 
                        height: "56px", 
                        background: "var(--primary-gradient)",
                        borderRadius: "16px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 24px rgba(245, 158, 11, 0.35)",
                        marginBottom: "12px"
                    }}>
                        <i className="bi bi-link-45deg text-white" style={{ fontSize: "28px" }}></i>
                    </div>
                    <div>
                        <span style={{ 
                            fontSize: "13px", 
                            fontWeight: 700, 
                            letterSpacing: "0.12em",
                            color: "var(--primary-accent)",
                            textTransform: "uppercase"
                        }}>SayLink</span>
                    </div>
                    <h2 className="mt-2 mb-0 gradient-text" style={{ fontSize: "1.65rem", fontWeight: 800 }}>{title}</h2>
                </div>
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;