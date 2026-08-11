import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../api/auth";
import { ToastContext } from "../../context/ToastContext";
import "./Auth.css";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { showToast } = useContext(ToastContext);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await loginUser(formData);
            login(data);
            setFormData({ email: "", password: "" });
            showToast("Welcome back! 👋", "success");
            navigate("/feed");
        } catch (error) {
            showToast(error.message || "Login failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Welcome back">
            <p className="text-muted text-center mb-4" style={{ fontSize: "14px" }}>
                Sign in to continue to SayLink
            </p>

            <form onSubmit={handleSubmit} noValidate>
                {/* EMAIL */}
                <div className="mb-3">
                    <label className="auth-label">
                        <i className="bi bi-envelope me-2"></i>Email address
                    </label>
                    <input
                        type="email"
                        className="auth-input"
                        placeholder="you@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* PASSWORD */}
                <div className="mb-4">
                    <label className="auth-label">
                        <i className="bi bi-lock me-2"></i>Password
                    </label>
                    <div className="auth-input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="auth-input"
                            placeholder="Enter your password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="auth-eye-btn"
                            onClick={() => setShowPassword(p => !p)}
                            tabIndex={-1}
                        >
                            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </button>
                    </div>
                </div>

                {/* SUBMIT */}
                <button
                    type="submit"
                    className="gradient-btn w-100 py-2"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Signing in…
                        </>
                    ) : (
                        <>
                            <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                        </>
                    )}
                </button>
            </form>

            {/* FOOTER */}
            <div className="text-center mt-4">
                <span className="text-muted" style={{ fontSize: "13px" }}>
                    Don&apos;t have an account?{" "}
                </span>
                <Link to="/signup" className="auth-link fw-semibold">
                    Sign up free
                </Link>
            </div>
        </AuthLayout>
    );
}

export default Login;