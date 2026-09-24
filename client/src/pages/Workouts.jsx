import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { workoutsApi } from "../api/workouts.js";
import { useToast } from "../context/useToast.js";
import { parseError } from "../utils/parseError.js";
import Skeleton from "../components/Skeleton.jsx";
import WorkoutForm from "../components/WorkoutForm.jsx";

function Workouts() {
  const { data: workouts, loading, error, refetch } = useFetch(() => workoutsApi.list(), []);
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const handleCreated = () => {
    setShowForm(false);
    refetch(); // pull the fresh list after creating
    showToast("Workout created successfully!", "success");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Workouts</h1>
          <p className="muted">Your training templates.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Cancel" : "+ New workout"}
        </button>
      </div>

      {showForm && <WorkoutForm onCreated={handleCreated} />}

      {loading && (
        <div style={{ marginTop: "1.5rem" }}>
          <Skeleton height="3rem" />
          <div style={{ marginTop: "0.75rem" }}>
            <Skeleton height="3rem" />
          </div>
        </div>
      )}

      {error && <p className="error-text" style={{ marginTop: "1rem" }}>{parseError(error, "Failed to load workouts")}</p>}

      {!loading && !error && workouts.length === 0 && (
        <p className="muted" style={{ marginTop: "1.5rem" }}>You haven't created any workouts yet.</p>
      )}

      {!loading && !error && workouts.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          {workouts.map((workout) => (
            <Link key={workout.id} to={`/workouts/${workout.id}`} className="list-row" style={{ color: "inherit" }}>
              <strong>{workout.name}</strong>
              <span className="muted" style={{ fontSize: "0.85rem" }}>
                {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workouts;