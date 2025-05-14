import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModalAceptar: React.FC<Props> = ({ title, message, onConfirm, onCancel }) => {
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
            color: "#1a1a1a",
            padding: "2rem",
            borderRadius: "16px",
            width: "90%",
            maxWidth: "440px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
            fontFamily: "system-ui, sans-serif",
            position: "relative",
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
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#555",
            }}
            aria-label="Cerrar"
          >
            &times;
          </button>

          <h2 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 600 }}>{title}</h2>
          <p style={{ marginTop: "1rem", lineHeight: 1.8, fontSize: "1.05rem" }}>{message}</p>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <button
              onClick={onCancel}
              style={{
                backgroundColor: "#e0e0e0",
                color: "#333",
                border: "none",
                padding: "0.8em 1.6em",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              style={{
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                padding: "0.8em 1.6em",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1rem",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#115293")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
            >
              Aceptar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModalAceptar;
