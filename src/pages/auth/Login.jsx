import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../api/auth";
import { ToastContext } from "../../context/ToastContext";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

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
            showToast("Login successful", "success");
            navigate("/feed");
        } catch (error) {
            showToast(error.message || "Login failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Welcome back">
            <p className="text-muted text-center mb-4">
                Login to continue to Saylink
            </p>

            <form onSubmit={handleSubmit} noValidate>
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
                        placeholder="Enter your password"
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
                    {loading ? "Logging in…" : "Login"}
                </button>
            </form>

            {/* FOOTER */}
            <div className="text-center mt-4">
                <span className="text-muted">
                    Don&apos;t have an account?
                </span>{" "}
                <Link to="/signup" className="fw-semibold">
                    Sign up
                </Link>
            </div>
        </AuthLayout>
    );
}

export default Login;   