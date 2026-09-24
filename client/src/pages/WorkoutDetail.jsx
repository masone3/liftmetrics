import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useFetch } from "../hooks/useFetch.js";
import { workoutsApi } from "../api/workouts.js";
import { parseError } from "../utils/parseError.js";
import { useToast } from "../context/useToast.js";
import { statsApi } from "../api/stats.js";
import ExerciseProgressChart from "../components/ExerciseProgressChart.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import LogSessionForm from "../components/LogSessionForm.jsx";
import Skeleton from "../components/Skeleton.jsx";

function WorkoutDetail() {
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { data: workout, loading, error, refetch } = useFetch(() => workoutsApi.getById(id), [id]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showLogSession, setShowLogSession] = useState(false);
  const [confirmDeleteWorkout, setConfirmDeleteWorkout] = useState(false);
  const [confirmDeleteExercise, setConfirmDeleteExercise] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);

  const handleDeleteWorkout = async () => {
    try {
      await workoutsApi.delete(id);
      navigate("/workouts");
      showToast("Workout deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete workout:", err);
      showToast(parseError(err, "Failed to delete workout"), "error");
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await workoutsApi.deleteExercise(id, exerciseId);
      setConfirmDeleteExercise(null);
      refetch();
      showToast("Exercise removed successfully!", "success");
    } catch (err) {
      console.error("Failed to remove exercise:", err);
      showToast(parseError(err, "Failed to remove exercise"), "error");
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
        : parseError(error, "Failed to load workout");

    return (
      <div>
        <p className="error-text">{message}</p>
        <Link to="/workouts">← Back to workouts</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/workouts" className="muted" style={{ fontSize: "0.85rem" }}>← Back to workouts</Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "0.5rem" }}>
        <div>
          <h1>{workout.name}</h1>
          {workout.description && <p className="muted">{workout.description}</p>}
        </div>
        <button className="btn-danger" onClick={() => setConfirmDeleteWorkout(true)}>
          Delete workout
        </button>
      </div>

      {confirmDeleteWorkout && (
        <ConfirmDialog
          message={`Delete "${workout.name}"? This will also delete all logged sessions for it.`}
          onConfirm={handleDeleteWorkout}
          onCancel={() => setConfirmDeleteWorkout(false)}
        />
      )}

      {workout.exercises.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <button className="btn-primary" onClick={() => setShowLogSession((prev) => !prev)}>
            {showLogSession ? "Cancel" : "Log a session"}
          </button>
          {showLogSession && <LogSessionForm workout={workout} onLogged={() => setShowLogSession(false)} />}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
        <h2 style={{ marginBottom: 0 }}>Exercises</h2>
        <button className="btn-ghost" onClick={() => setShowAddExercise((prev) => !prev)}>
          {showAddExercise ? "Cancel" : "+ Add exercise"}
        </button>
      </div>

      {showAddExercise && (
        <AddExerciseForm
          workoutId={id}
          onAdded={() => {
            setShowAddExercise(false);
            refetch();
          }}
          showToast={showToast}
        />
      )}

      {workout.exercises.length === 0 ? (
        <p className="muted" style={{ marginTop: "1rem" }}>No exercises yet — add one above.</p>
      ) : (
        <div style={{ marginTop: "0.75rem" }}>
          {workout.exercises
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((exercise) => (
              <div key={exercise.id} className="list-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <strong>{exercise.name}</strong>
                    {exercise.targetMuscle && <span className="muted"> — {exercise.targetMuscle}</span>}
                    <span style={{ marginLeft: "0.5rem", color: "var(--accent)", fontSize: "0.85rem" }}>
                      {expandedExercise === exercise.id ? "Hide progress" : "Show progress"}
                    </span>
                  </span>
                  <button className="btn-ghost" onClick={() => setConfirmDeleteExercise(exercise.id)}>
                    Remove
                  </button>
                </div>
                {expandedExercise === exercise.id && (
                  <ExerciseProgress exerciseId={exercise.id} exerciseName={exercise.name} />
                )}
              </div>
            ))}
        </div>
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

function AddExerciseForm({ workoutId, onAdded, showToast }) {
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
      showToast("Exercise added successfully!", "success");
    } catch (err) {
      console.error("Failed to add exercise:", err);
      setServerError(parseError(err, "Failed to add exercise"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="panel form-row" style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <input placeholder="Exercise name" {...register("name", { required: "Required" })} />
        {errors.name && <p className="error-text">{errors.name.message}</p>}
      </div>
      <input placeholder="Target muscle (optional)" style={{ flex: 1 }} {...register("targetMuscle")} />
      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add"}
      </button>
      {serverError && <p className="error-text">{serverError}</p>}
    </form>
  );
}

function ExerciseProgress({ exerciseId, exerciseName }) {
  const { data, loading, error } = useFetch(() => statsApi.exerciseProgress(exerciseId), [exerciseId]);

  if (loading) return <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Loading progress...</p>;
  if (error) return <p className="error-text" style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Couldn't load progress data.</p>;
  if (data.length < 2) {
    return <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Log this exercise a few more times to see a trend.</p>;
  }

  return (
    <div className="panel" style={{ marginTop: "0.75rem" }}>
      <ExerciseProgressChart data={data} exerciseName={exerciseName} />
    </div>
  );
}

export default WorkoutDetail;