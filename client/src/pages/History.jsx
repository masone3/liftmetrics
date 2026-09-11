import { useState } from "react";
import dayjs from "dayjs";
import { useFetch } from "../hooks/useFetch.js";
import { workoutLogsApi } from "../api/workoutLogs.js";
import Skeleton from "../components/Skeleton.jsx";

function History() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data: logs, loading, error } = useFetch(
    () => workoutLogsApi.list({
      ...(from && { from: dayjs(from).startOf("day").toISOString() }),
      ...(to && { to: dayjs(to).endOf("day").toISOString() }),
    }),
    [from, to]
  );

  return (
    <div>
      <h1>Workout History</h1>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", alignItems: "flex-end" }}>
        <div>
          <label htmlFor="from">From</label>
          <input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label htmlFor="to">To</label>
          <input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        {(from || to) && (
          <button onClick={() => { setFrom(""); setTo(""); }}>
            Clear filters
          </button>
        )}
      </div>

      {loading && (
        <div style={{ marginTop: "1.5rem" }}>
          <Skeleton height="5rem" />
          <div style={{ marginTop: "0.75rem" }}>
            <Skeleton height="5rem" />
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          Failed to load history: {error.body?.error || error.message}
        </p>
      )}

      {!loading && !error && logs.length === 0 && (
        <p style={{ marginTop: "1.5rem" }}>No sessions logged in this range.</p>
      )}

      {!loading && !error && logs.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "1.5rem" }}>
          {logs.map((log) => (
            <li
              key={log.id}
              style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{log.workout.name}</strong>
                <span style={{ color: "#666" }}>{dayjs(log.performedAt).format("MMM D, YYYY")}</span>
              </div>
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                {log.setEntries.map((set) => (
                  <li key={set.id}>
                    {set.exercise.name}: {set.reps} reps @ {set.weight} lbs
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default History;