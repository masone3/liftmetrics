import { Link, Outlet } from "react-router-dom";

function Layout() {
    return (
        <div>
            <nav style={{ display: "flex", gap: "1rem", padding:" 1rem", borderBottom: "1px solid #ddd" }}>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/workouts">Workouts</Link>
            </nav>
            <main style={{ padding: "2rem" }}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;