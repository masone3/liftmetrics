import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useFetch } from "../hooks/useFetch.js";
import { workoutsApi } from "../api/workouts.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import LogSessionForm from "../components/LogSessionForm.jsx";
import Skeleton from "../components/Skeleton.jsx";

function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: workout, loading, error, refetch } = useFetch(() => workoutsApi.getById(id), [id]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showLogSession, setShowLogSession] = useState(false);
  const [confirmDeleteWorkout, setConfirmDeleteWorkout] = useState(false);
  const [confirmDeleteExercise, setConfirmDeleteExercise] = useState(null);

  const handleDeleteWorkout = async () => {
    try {
      await workoutsApi.delete(id);
      navigate("/workouts");
    } catch (err) {
      console.error("Failed to delete workout:", err);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await workoutsApi.deleteExercise(id, exerciseId);
      setConfirmDeleteExercise(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete exercise:", err);
    }
  };

  if (loading) {
    return (
      <div>
        <Skeleton height="2rem" width="250px" />
        <div style={{ marginTop: "1rem" }}>
          <Skeleton height="1.5rem" />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <Skeleton height="1.5rem" />
        </div>
      </div>
    );
  }

  if (error) {
    const message =
      error.status === 404
        ? "Workout not found."
        : error.status === 403
        ? "You don't have access to this workout."
        : error.body?.error || "Failed to load workout.";

    return (
      <div>
        <p style={{ color: "red" }}>{message}</p>
        <Link to="/workouts">← Back to workouts</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/workouts">← Back to workouts</Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{workout.name}</h1>
        <button onClick={() => setConfirmDeleteWorkout(true)} style={{ color: "#d9534f" }}>
          Delete Workout
        </button>
      </div>

      {workout.description && <p style={{ color: "#666" }}>{workout.description}</p>}

      {confirmDeleteWorkout && (
        <ConfirmDialog
          message={`Delete "${workout.name}"? This will also delete all logged sessions for it.`}
          onConfirm={handleDeleteWorkout}
          onCancel={() => setConfirmDeleteWorkout(false)}
        />
      )}

      {workout.exercises.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={() => setShowLogSession((prev) => !prev)}>
            {showLogSession ? "Cancel" : "Log a Session"}
          </button>
          {showLogSession && (
            <LogSessionForm
              workout={workout}
              onLogged={() => setShowLogSession(false)}
            />
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
        <h2>Exercises</h2>
        <button onClick={() => setShowAddExercise((prev) => !prev)}>
          {showAddExercise ? "Cancel" : "+ Add Exercise"}
        </button>
      </div>

      {showAddExercise && (
        <AddExerciseForm
          workoutId={id}
          onAdded={() => {
            setShowAddExercise(false);
            refetch();
          }}
        />
      )}

      {workout.exercises.length === 0 ? (
        <p style={{ marginTop: "1rem" }}>No exercises yet — add one above.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
          {workout.exercises
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((exercise) => (
              <li
                key={exercise.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  marginBottom: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  <strong>{exercise.name}</strong>
                  {exercise.targetMuscle && <span style={{ color: "#666" }}> — {exercise.targetMuscle}</span>}
                </span>
                <button onClick={() => setConfirmDeleteExercise(exercise.id)}>Remove</button>
              </li>
            ))}
        </ul>
      )}

      {confirmDeleteExercise && (
        <ConfirmDialog
          message="Remove this exercise from the workout?"
          onConfirm={() => handleDeleteExercise(confirmDeleteExercise)}
          onCancel={() => setConfirmDeleteExercise(null)}
        />
      )}
    </div>
  );
}

function AddExerciseForm({ workoutId, onAdded }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await workoutsApi.addExercise(workoutId, data);
      reset();
      onAdded();
    } catch (err) {
      console.error("Failed to add exercise:", err);
      setServerError(err.body?.error || "Failed to add exercise");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", alignItems: "flex-start" }}
    >
      <div>
        <input placeholder="Exercise name" {...register("name", { required: "Required" })} />
        {errors.name && <p style={{ color: "red", fontSize: "0.85rem" }}>{errors.name.message}</p>}
      </div>
      <input placeholder="Target muscle (optional)" {...register("targetMuscle")} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add"}
      </button>
      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
    </form>
  );
}

export default WorkoutDetail;