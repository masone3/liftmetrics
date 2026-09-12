function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      }}
    >
      <div style={{ background: "white", padding: "1.5rem", borderRadius: "8px", maxWidth: "320px" }}>
        <p>{message}</p>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", justifyContent: "flex-end" }}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} style={{ background: "#d9534f", color: "white" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;