function AuthLayout({ title, children }) {
    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="mb-4 text-center">{title}</h2>
            {children}
        </div>
    );
}

export default AuthLayout;