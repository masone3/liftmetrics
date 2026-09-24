import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { workoutsApi } from "../api/workouts.js";
import { parseError } from "../utils/parseError.js";

function WorkoutForm({ onCreated }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      exercises: [{ name: "", targetMuscle: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "exercises" });
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const payload = {
        name: data.name,
        description: data.description || undefined,
        exercises: data.exercises
          .filter((ex) => ex.name.trim() !== "")
          .map((ex, i) => ({ ...ex, order: i + 1 })),
      };
      await workoutsApi.create(payload);
      onCreated();
    } catch (err) {
      console.error("Failed to create workout:", err);
      setServerError(parseError(err, "Failed to create workout"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="panel">
      <div className="field">
        <label htmlFor="name">Workout name</label>
        <input id="name" {...register("name", { required: "Name is required" })} />
        {errors.name && <p className="error-text">{errors.name.message}</p>}
      </div>

      <div className="field">
        <label htmlFor="description">Description (optional)</label>
        <input id="description" {...register("description")} />
      </div>

      <div className="field">
        <label>Exercises</label>
        {fields.map((field, index) => (
          <div key={field.id} className="form-row" style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <input placeholder="Exercise name" {...register(`exercises.${index}.name`)} />
            <input placeholder="Target muscle (optional)" {...register(`exercises.${index}.targetMuscle`)} />
            {fields.length > 1 && (
              <button type="button" className="btn-ghost" onClick={() => remove(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost"
          onClick={() => append({ name: "", targetMuscle: "" })}
          style={{ marginTop: "0.5rem" }}
        >
          + Add exercise
        </button>
      </div>

      {serverError && <p className="error-text" style={{ marginTop: "0.75rem" }}>{serverError}</p>}

      <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: "1.5rem" }}>
        {isSubmitting ? "Creating..." : "Create workout"}
      </button>
    </form>
  );
}

export default WorkoutForm;