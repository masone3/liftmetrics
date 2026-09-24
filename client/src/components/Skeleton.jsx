function Skeleton({ width = "100%", height = "1rem", borderRadius = "6px" }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, #ece9e3 25%, #f5f3ef 50%, #ece9e3 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

export default Skeleton;