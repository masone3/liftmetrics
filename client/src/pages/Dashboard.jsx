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
        <p className="error-text">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>Your training at a glance.</p>

      <div className="stat-cards" style={{ display: "flex", gap: "1rem" }}>
        <StatCard label="Workouts" value={summary.workoutCount} />
        <StatCard label="Sessions logged" value={summary.totalSessionsLogged} />
        <StatCard
          label="Last session"
          value={summary.lastSessionDate ? new Date(summary.lastSessionDate).toLocaleDateString() : "—"}
        />
      </div>

      <h2 style={{ marginTop: "2.5rem" }}>Training volume</h2>
      {volumeData.length === 0 ? (
        <p className="muted">Log a few sessions to see your progress here.</p>
      ) : (
        <div className="panel">
          <VolumeChart data={volumeData} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card" style={{ flex: 1, minWidth: "140px" }}>
      <div className="muted" style={{ fontSize: "0.82rem", marginBottom: "0.4rem" }}>{label}</div>
      <div className="num" style={{ fontSize: "1.75rem", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default Dashboard;