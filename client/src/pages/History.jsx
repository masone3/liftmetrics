import { useState } from "react";
import dayjs from "dayjs";
import { useFetch } from "../hooks/useFetch.js";
import { workoutLogsApi } from "../api/workoutLogs.js";
import { parseError } from "../utils/parseError.js";
import { useToast } from "../context/useToast.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Skeleton from "../components/Skeleton.jsx";

function History() {
  const [from, setFrom] = useState("");
  const { showToast } = useToast();
  const [to, setTo] = useState("");
  const [confirmDeleteLog, setConfirmDeleteLog] = useState(null);

  const { data: logs, loading, error, refetch } = useFetch(
    () => workoutLogsApi.list({
      ...(from && { from: dayjs(from).startOf("day").toISOString() }),
      ...(to && { to: dayjs(to).endOf("day").toISOString() }),
    }),
    [from, to]
  );

  const handleDeleteLog = async (logId) => {
    try {
      await workoutLogsApi.delete(logId);
      setConfirmDeleteLog(null);
      refetch();
      showToast("Logged session deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete log:", err);
      showToast(parseError(err, "Failed to delete log"), "error");
    }
  };

  return (
    <div>
      <h1>Workout history</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>Everything you've logged.</p>

      <div className="form-row" style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
        <div className="field" style={{ marginTop: 0 }}>
          <label htmlFor="from">From</label>
          <input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="field" style={{ marginTop: 0 }}>
          <label htmlFor="to">To</label>
          <input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        {(from || to) && (
          <button className="btn-ghost" onClick={() => { setFrom(""); setTo(""); }}>
            Clear filters
          </button>
        )}
      </div>

      {loading && (
        <div style={{ marginTop: "1.5rem" }}>
          <Skeleton height="4rem" />
          <div style={{ marginTop: "0.75rem" }}>
            <Skeleton height="4rem" />
          </div>
        </div>
      )}

      {error && <p className="error-text" style={{ marginTop: "1rem" }}>{parseError(error, "Failed to load history")}</p>}

      {!loading && !error && logs.length === 0 && (
        <p className="muted" style={{ marginTop: "1.5rem" }}>No sessions logged in this range.</p>
      )}

      {!loading && !error && logs.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          {logs.map((log) => (
            <div key={log.id} className="list-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{log.workout.name}</strong>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span className="muted" style={{ fontSize: "0.85rem" }}>
                    {dayjs(log.performedAt).format("MMM D, YYYY")}
                  </span>
                  <button className="btn-ghost" onClick={() => setConfirmDeleteLog(log.id)}>Delete</button>
                </div>
              </div>
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.1rem", color: "var(--ink-muted)", fontSize: "0.9rem" }}>
                {log.setEntries.map((set) => (
                  <li key={set.id}>
                    {set.exercise.name}: <span className="num">{set.reps} reps @ {set.weight} lbs</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {confirmDeleteLog && (
        <ConfirmDialog
          message="Delete this logged session? This cannot be undone."
          onConfirm={() => handleDeleteLog(confirmDeleteLog)}
          onCancel={() => setConfirmDeleteLog(null)}
        />
      )}
    </div>
  );
}

export default History;