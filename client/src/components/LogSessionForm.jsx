import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import dayjs from "dayjs";
import { workoutLogsApi } from "../api/workoutLogs.js";
import { parseError } from "../utils/parseError.js";
import { useToast } from "../context/useToast.js";

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
  const { showToast } = useToast();

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
      showToast("Workout session logged successfully!", "success");
    } catch (err) {
      console.error("Failed to log session:", err);
      setServerError(parseError(err, "Failed to log session"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="panel">
      <div className="field">
        <label htmlFor="performedAt">Date</label>
        <input id="performedAt" type="date" style={{ maxWidth: "220px" }} {...register("performedAt", { required: "Date is required" })} />
        {errors.performedAt && <p className="error-text">{errors.performedAt.message}</p>}
      </div>

      <div className="field">
        <label>Sets</label>
        {fields.map((field, index) => (
          <div key={field.id} className="form-row" style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
            <span className="muted" style={{ minWidth: "120px", fontSize: "0.9rem" }}>{field.exerciseName}</span>
            <input type="number" placeholder="Reps" className="num" style={{ width: "90px" }} {...register(`sets.${index}.reps`, { required: true, min: 1 })} />
            <input type="number" step="0.5" placeholder="Weight" className="num" style={{ width: "90px" }} {...register(`sets.${index}.weight`, { required: true, min: 0 })} />
            <button
              type="button"
              className="btn-ghost"
              onClick={() => append({ exerciseId: field.exerciseId, exerciseName: field.exerciseName, reps: "", weight: "" })}
            >
              + Set
            </button>
            {fields.length > workout.exercises.length && (
              <button type="button" className="btn-ghost" onClick={() => remove(index)}>Remove</button>
            )}
          </div>
        ))}
      </div>

      {serverError && <p className="error-text" style={{ marginTop: "0.75rem" }}>{serverError}</p>}

      <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: "1rem" }}>
        {isSubmitting ? "Logging..." : "Log session"}
      </button>
    </form>
  );
}

export default LogSessionForm;