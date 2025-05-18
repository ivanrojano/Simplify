import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal: React.FC<Props> = ({ title, message, onConfirm, onCancel }) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (backdropRef.current && e.target === backdropRef.current) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  return (
    <AnimatePresence>
      <motion.div
        ref={backdropRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "16px",
            width: "90%",
            maxWidth: "440px",
            fontFamily: "system-ui, sans-serif",
            position: "relative",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}
        >
          <button
            onClick={onCancel}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "none",
              border: "none",
              fontSize: "2rem",
              cursor: "pointer",
              color: "#555",
            }}
            aria-label="Cerrar"
          >
            &times;
          </button>

          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 600, marginBottom: "1rem" }}>
              {title}
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.6 }}>{message}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <button
              onClick={onConfirm}
              style={{
                width: "100%",
                backgroundColor: "#d32f2f",
                color: "white",
                padding: "0.9em 1.6em",
                borderRadius: "10px",
                border: "none",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#b71c1c")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#d32f2f")}
            >
              Confirmar
            </button>

            <button
              onClick={onCancel}
              style={{
                width: "100%",
                backgroundColor: "#e0e0e0",
                color: "#333",
                padding: "0.9em 1.6em",
                borderRadius: "10px",
                border: "none",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
