import React, { useEffect, useState } from "react";

export default function MaintenanceModal({
  isOpen = false,
  title = "Website Under Maintenance",
  message = "We’re performing scheduled maintenance to improve performance and security. Please check back soon.",
  subMessage = "If you need urgent support, contact us at support@1cglobal.cc",
}) {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  // Lock scroll when modal open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  if (!open) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <div style={styles.badge}>Maintenance</div>

        <h2 style={styles.title}>{title}</h2>
        <p style={styles.text}>{message}</p>
        <p style={styles.subText}>{subMessage}</p>

        <div style={styles.hr} />

        <div style={styles.note}>
          We’ll be back shortly. Thank you for your patience.
        </div>

        {/* Optional: If you want NO close button, remove this */}
        <button
          onClick={() => setOpen(false)}
          style={styles.btn}
          aria-label="Close maintenance popup"
        >
          Okay
        </button>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999999,
    padding: 16,
  },
  modal: {
    width: "100%",
    maxWidth: 520,
    background: "#0b1220",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 22,
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    color: "#fff",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  badge: {
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255, 193, 7, 0.14)",
    border: "1px solid rgba(255, 193, 7, 0.35)",
    color: "#FFC107",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.2,
  },
  text: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.5,
  },
  subText: {
    marginTop: 0,
    marginBottom: 0,
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 1.5,
  },
  hr: {
    height: 1,
    background: "rgba(255,255,255,0.12)",
    margin: "16px 0",
  },
  note: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 14,
  },
  btn: {
    width: "100%",
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};