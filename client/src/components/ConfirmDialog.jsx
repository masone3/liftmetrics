function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(26,26,24,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      }}
    >
      <div className="card" style={{ maxWidth: "320px", boxShadow: "0 12px 32px rgba(0,0,0,0.18)" }}>
        <p>{message}</p>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem", justifyContent: "flex-end" }}>
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;