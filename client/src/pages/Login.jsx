import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "../context/useAuth.js";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login, sessionExpired } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json();

      if (!res.ok) {
        setServerError(body.error || "Login failed");
        return;
      }

      login(body.token, body.user); // replaces the old localStorage.setItem line
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "360px" }}>
      <h1>Log in</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>Welcome back.</p>

      {sessionExpired && (
        <div className="panel" style={{ borderColor: "var(--danger)", background: "var(--danger-tint)", color: "var(--danger)", fontSize: "0.9rem" }}>
          Your session expired. Please log in again.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register("email", { required: "Email is required" })} />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register("password", { required: "Password is required" })} />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        {serverError && <p className="error-text" style={{ marginTop: "0.75rem" }}>{serverError}</p>}

        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: "100%", marginTop: "1.5rem" }}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="muted" style={{ marginTop: "1.25rem", fontSize: "0.9rem" }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;