import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <Link to="/">Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/workouts">Workouts</Link>
            <span>Hi, {user?.name}</span>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;