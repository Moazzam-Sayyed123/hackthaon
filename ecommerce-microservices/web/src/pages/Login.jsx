import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    const success = await login(email, password, role);
    setLoading(false);

    if (success) {
      navigate("/home");
    } else {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div className="card" style={{ width: "100%", maxWidth: 380, boxShadow: "0 8px 28px rgba(0,0,0,0.15)" }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="mb-2" style={{ color: "#667eea" }}>
              <i className="bi bi-shop"></i> E-Commerce
            </h2>
            <p className="text-muted">Welcome back!</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-bold">Email Address</label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">From login form</label>
              <div className="btn-group w-100" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="role"
                  id="roleUser"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="roleUser">
                  <i className="bi bi-person"></i> User
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="role"
                  id="roleVendor"
                  value="vendor"
                  checked={role === "vendor"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="roleVendor">
                  <i className="bi bi-briefcase"></i> Vendor
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 mb-3"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-muted small">
              Demo: Use any email/password to login
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
