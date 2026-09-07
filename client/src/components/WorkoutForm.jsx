import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { workoutsApi } from "../api/workouts.js";

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
      setServerError(err.body?.error || "Failed to create workout");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", marginTop: "1rem" }}
    >
      <div>
        <label htmlFor="name">Workout Name</label>
        <input id="name" {...register("name", { required: "Name is required" })} />
        {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
      </div>

      <div style={{ marginTop: "0.75rem" }}>
        <label htmlFor="description">Description (optional)</label>
        <input id="description" {...register("description")} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Exercises</label>
        {fields.map((field, index) => (
          <div key={field.id} style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <input
              placeholder="Exercise name"
              {...register(`exercises.${index}.name`)}
            />
            <input
              placeholder="Target muscle (optional)"
              {...register(`exercises.${index}.targetMuscle`)}
            />
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => append({ name: "", targetMuscle: "" })} style={{ marginTop: "0.5rem" }}>
          + Add Exercise
        </button>
      </div>

      {serverError && <p style={{ color: "red", marginTop: "0.75rem" }}>{serverError}</p>}

      <button type="submit" disabled={isSubmitting} style={{ marginTop: "1rem" }}>
        {isSubmitting ? "Creating..." : "Create Workout"}
      </button>
    </form>
  );
}

export default WorkoutForm;