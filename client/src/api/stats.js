import { api } from "./client.js";

export const statsApi = {
  summary: () => api.get("/stats/summary"),
  volume: () => api.get("/stats/volume"),
  exerciseProgress: (exerciseId) => api.get(`/stats/exercise/${exerciseId}`),
};