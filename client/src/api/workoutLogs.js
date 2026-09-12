import { api } from "./client.js";

export const workoutLogsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/workout-logs${query ? `?${query}` : ""}`);
  },
  getById: (id) => api.get(`/workout-logs/${id}`),
  create: (data) => api.post("/workout-logs", data),
  delete: (id) => api.delete(`/workout-logs/${id}`),
};