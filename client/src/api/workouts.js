import { api } from "./client.js";

export const workoutsApi = {
  list: () => api.get("/workouts"),
  getById: (id) => api.get(`/workouts/${id}`),
  create: (data) => api.post("/workouts", data),
  update: (id, data) => api.patch(`/workouts/${id}`, data),
  delete: (id) => api.delete(`/workouts/${id}`),
  addExercise: (workoutId, data) => api.post(`/workouts/${workoutId}/exercises`, data),
  updateExercise: (workoutId, exerciseId, data) => api.patch(`/workouts/${workoutId}/exercises/${exerciseId}`, data),
  deleteExercise: (workoutId, exerciseId) => api.delete(`/workouts/${workoutId}/exercises/${exerciseId}`),
};