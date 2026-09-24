function Toast({ toast }) {
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: isError ? "var(--danger)" : "var(--accent)",
        color: "white",
        padding: "0.75rem 1.25rem",
        borderRadius: "var(--radius-sm)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
        fontSize: "0.9rem",
        zIndex: 2000,
      }}
    >
      {toast.message}
    </div>
  );
}

export default Toast;