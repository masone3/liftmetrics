import { useFetch } from "../hooks/useFetch.js";
import { workoutsApi } from "../api/workouts.js";
import Skeleton from "../components/Skeleton.jsx";

function Dashboard() {
  const { data: workouts, loading, error } = useFetch(() => workoutsApi.list(), []);

  if (loading) {
    return (
      <div>
        <h1>Dashboard</h1>
        <Skeleton height="2rem" width="200px" />
        <div style={{ marginTop: "1rem" }}>
          <Skeleton height="1.5rem" width="100%" />
          <div style={{ marginTop: "0.5rem" }}>
            <Skeleton height="1.5rem" width="100%" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p style={{ color: "red" }}>Failed to load your workouts: {error.body?.error || error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>You have {workouts.length} workout{workouts.length !== 1 ? "s" : ""}.</p>
    </div>
  );
}

export default Dashboard;