import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import dayjs from "dayjs";
import { workoutLogsApi } from "../api/workoutLogs.js";

function LogSessionForm({ workout, onLogged }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      performedAt: dayjs().format("YYYY-MM-DD"),
      sets: workout.exercises.map((ex) => ({
        exerciseId: ex.id,
        exerciseName: ex.name,
        reps: "",
        weight: "",
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "sets" });
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const payload = {
        workoutId: workout.id,
        performedAt: dayjs(data.performedAt).toISOString(),
        setEntries: data.sets.map((set, i) => ({
          exerciseId: set.exerciseId,
          reps: Number(set.reps),
          weight: Number(set.weight),
          order: i + 1,
        })),
      };
      await workoutLogsApi.create(payload);
      onLogged();
    } catch (err) {
      console.error("Failed to log session:", err);
      const message = Array.isArray(err.body?.error)
        ? err.body.error.map((issue) => issue.message).join(", ")
        : err.body?.error || "Failed to log session";
      setServerError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", marginTop: "1rem" }}
    >
      <div>
        <label htmlFor="performedAt">Date</label>
        <input
          id="performedAt"
          type="date"
          {...register("performedAt", { required: "Date is required" })}
        />
        {errors.performedAt && <p style={{ color: "red" }}>{errors.performedAt.message}</p>}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Sets</label>
        {fields.map((field, index) => (
          <div key={field.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
            <span style={{ minWidth: "120px" }}>{field.exerciseName}</span>
            <input
              type="number"
              placeholder="Reps"
              style={{ width: "80px" }}
              {...register(`sets.${index}.reps`, { required: true, min: 1 })}
            />
            <input
              type="number"
              step="0.5"
              placeholder="Weight"
              style={{ width: "80px" }}
              {...register(`sets.${index}.weight`, { required: true, min: 0 })}
            />
            <button
              type="button"
              onClick={() =>
                append({
                  exerciseId: field.exerciseId,
                  exerciseName: field.exerciseName,
                  reps: "",
                  weight: "",
                })
              }
            >
              + Another set
            </button>
            {fields.length > workout.exercises.length && (
              <button type="button" onClick={() => remove(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {serverError && <p style={{ color: "red", marginTop: "0.75rem" }}>{serverError}</p>}

      <button type="submit" disabled={isSubmitting} style={{ marginTop: "1rem" }}>
        {isSubmitting ? "Logging..." : "Log Session"}
      </button>
    </form>
  );
}

export default LogSessionForm;