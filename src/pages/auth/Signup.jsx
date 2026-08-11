import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { signupUser } from "../../api/auth";
import { ToastContext } from "../../context/ToastContext";
import "./Auth.css";

function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { showToast } = useContext(ToastContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signupUser(formData);
            showToast("Account created! Welcome to SayLink 🎉", "success");
            setFormData({ username: "", email: "", password: "" });
            navigate("/login");
        } catch (error) {
            showToast(error.message || "Signup failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create account">
            <p className="text-muted text-center mb-4" style={{ fontSize: "14px" }}>
                Join SayLink and start connecting
            </p>

            <form onSubmit={handleSubmit} noValidate>
                {/* USERNAME */}
                <div className="mb-3">
                    <label className="auth-label">
                        <i className="bi bi-at me-2"></i>Username
                    </label>
                    <input
                        type="text"
                        className="auth-input"
                        placeholder="Choose a unique username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

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
                            placeholder="Create a strong password"
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
                            Creating account…
                        </>
                    ) : (
                        <>
                            <i className="bi bi-person-plus me-2"></i>Create Account
                        </>
                    )}
                </button>
            </form>

            {/* FOOTER */}
            <div className="text-center mt-4">
                <span className="text-muted" style={{ fontSize: "13px" }}>
                    Already have an account?{" "}
                </span>
                <Link to="/login" className="auth-link fw-semibold">
                    Sign in
                </Link>
            </div>
        </AuthLayout>
    );
}

export default Signup;