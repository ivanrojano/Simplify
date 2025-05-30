import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

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
            backgroundColor: "#fafafa",
            padding: "2.5rem 2rem 2rem",
            borderRadius: "16px",
            width: "90%",
            maxWidth: "440px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            fontFamily: "system-ui, sans-serif",
            position: "relative",
            textAlign: "center",
          }}
        >
          <IconButton
            onClick={onCancel}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#555",
            }}
            aria-label="Cerrar"
          >
            <CloseIcon />
          </IconButton>

          <WarningAmberIcon sx={{ fontSize: 50, color: "#f39c12", mb: 1 }} />

          <h2 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 900, color: "#0d47a1" }}>
            {title}
          </h2>

          <p
            style={{
              marginTop: "1.2rem",
              marginBottom: "2rem",
              lineHeight: 1.7,
              fontSize: "1.05rem",
              color: "#333",
            }}
          >
            {message}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={onCancel}
              style={{
                backgroundColor: "#e0e0e0",
                color: "#333",
                border: "none",
                padding: "0.75em 1.5em",
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
                backgroundColor: "#0d47a1",
                color: "white",
                border: "none",
                padding: "0.75em 1.5em",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1rem",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1565c0")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0d47a1")}
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
