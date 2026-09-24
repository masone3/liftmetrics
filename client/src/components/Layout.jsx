import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { useToast } from "../context/useToast.js";
import Toast from "./Toast.jsx";

function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <nav
        className="nav-links"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        <Link to="/" style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>
          Liftmetrics
        </Link>
        <div style={{ display: "flex", gap: "1.25rem", marginLeft: "auto", alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/workouts">Workouts</Link>
              <Link to="/history">History</Link>
              <span className="muted" style={{ fontSize: "0.85rem" }}>{user?.name}</span>
              <button className="btn-ghost" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main className="container" style={{ padding: "2.5rem 1.5rem" }}>
        <Outlet />
      </main>
      <Toast toast={toast} />
    </div>
  );
}

export default Layout;