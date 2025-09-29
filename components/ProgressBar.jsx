import React from "react";

export default function ProgressBar({ total, current }) {
  // Avoid division by zero
  const safeTotal = total > 0 ? total : 1;

  // Calculate percentage
  const progress = Math.min(Math.max((current / safeTotal) * 100, 0), 100);

  return (
    <div style={styles.container}>
      <div style={{ ...styles.bar, width: `${progress}%` }} />
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    width: "98%",
    height: "10px",
    backgroundColor: "#eee",
    borderRadius: "15px",
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: "#f9a96bff",
    transition: "width 0.3s ease-in-out",
  },
  label: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    top: "50%",
    transform: "translateY(-50%)",
    fontWeight: "bold",
  },
};
