function Toast({ toast }) {
  if (!toast) return null;

  const backgroundColor = toast.type === "error" ? "#d9534f" : "#2f9e44";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: backgroundColor,
        color: "white",
        padding: "0.75rem 1.25rem",
        borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 2000,
      }}
    >
      {toast.message}
    </div>
  );
}

export default Toast;