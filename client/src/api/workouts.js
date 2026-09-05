import { api } from "./client.js";

export const workoutsApi = {
  list: () => api.get("/workouts"),
  getById: (id) => api.get(`/workouts/${id}`),
  create: (data) => api.post("/workouts", data),
  addExercise: (workoutId, data) => api.post(`/workouts/${workoutId}/exercises`, data),
};