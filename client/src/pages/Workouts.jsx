import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { workoutsApi } from "../api/workouts.js";
import Skeleton from "../components/Skeleton.jsx";
import WorkoutForm from "../components/WorkoutForm.jsx";

function Workouts() {
  const { data: workouts, loading, error, refetch } = useFetch(() => workoutsApi.list(), []);
  const [showForm, setShowForm] = useState(false);

  const handleCreated = () => {
    setShowForm(false);
    refetch(); // pull the fresh list after creating
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Workouts</h1>
        <button onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Cancel" : "+ New Workout"}
        </button>
      </div>

      {showForm && <WorkoutForm onCreated={handleCreated} />}

      {loading && (
        <div style={{ marginTop: "1.5rem" }}>
          <Skeleton height="4rem" />
          <div style={{ marginTop: "0.75rem" }}>
            <Skeleton height="4rem" />
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: "red" }}>
          Failed to load workouts: {error.body?.error || error.message}
        </p>
      )}

      {!loading && !error && workouts.length === 0 && (
        <p style={{ marginTop: "1.5rem" }}>You haven't created any workouts yet.</p>
      )}

      {!loading && !error && workouts.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "1.5rem" }}>
          {workouts.map((workout) => (
            <li
              key={workout.id}
              style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem" }}
            >
              <Link to={`/workouts/${workout.id}`}>
                <strong>{workout.name}</strong>
              </Link>
              <p style={{ margin: "0.25rem 0 0", color: "#666" }}>
                {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Workouts;