import { useFetch } from "../hooks/useFetch.js";
import { statsApi } from "../api/stats.js";
import Skeleton from "../components/Skeleton.jsx";
import VolumeChart from "../components/VolumeChart.jsx";

function Dashboard() {
  const { data: summary, loading: summaryLoading, error: summaryError } = useFetch(() => statsApi.summary(), []);
  const { data: volumeData, loading: volumeLoading, error: volumeError } = useFetch(() => statsApi.volume(), []);

  if (summaryLoading || volumeLoading) {
    return (
      <div>
        <h1>Dashboard</h1>
        <Skeleton height="2rem" width="200px" />
        <div style={{ marginTop: "1rem" }}>
          <Skeleton height="300px" />
        </div>
      </div>
    );
  }

  if (summaryError || volumeError) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p style={{ color: "red" }}>Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
        <StatCard label="Workouts" value={summary.workoutCount} />
        <StatCard label="Sessions Logged" value={summary.totalSessionsLogged} />
        <StatCard
          label="Last Session"
          value={summary.lastSessionDate ? new Date(summary.lastSessionDate).toLocaleDateString() : "—"}
        />
      </div>

      <h2 style={{ marginTop: "2rem" }}>Training Volume Over Time</h2>
      {volumeData.length === 0 ? (
        <p>Log a few sessions to see your progress here.</p>
      ) : (
        <VolumeChart data={volumeData} />
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", minWidth: "140px" }}>
      <div style={{ color: "#666", fontSize: "0.85rem" }}>{label}</div>
      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</div>
    </div>
  );
}

export default Dashboard;