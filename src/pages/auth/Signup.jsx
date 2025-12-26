import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { signupUser } from "../../api/auth";
import { ToastContext } from "../../context/ToastContext";

function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

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
            showToast("Account created successfully", "success");
            setFormData({ username: "", email: "", password: "" });
            navigate("/login");
        } catch (error) {
            showToast(error.message || "Signup failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create your account">
            <p className="text-muted text-center mb-4">
                Join Saylink and start sharing
            </p>

            <form onSubmit={handleSubmit} noValidate>
                {/* USERNAME */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Choose a unique username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* EMAIL */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="you@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* PASSWORD */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Create a strong password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* SUBMIT */}
                <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                >
                    {loading ? "Creating account…" : "Sign up"}
                </button>
            </form>

            {/* FOOTER */}
            <div className="text-center mt-4">
                <span className="text-muted">
                    Already have an account?
                </span>{" "}
                <Link to="/login" className="fw-semibold">
                    Login
                </Link>
            </div>
        </AuthLayout>
    );
}

export default Signup;