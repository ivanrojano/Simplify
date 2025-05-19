import { useState, useRef, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";

interface MensajeCortos {
  contenido: string;
  fecha: string;
  esEmpresa: boolean;
}

const MensajeCortos: React.FC<MensajeCortos> = ({ contenido, fecha, esEmpresa }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > 60); 
    }
  }, [contenido]);

  return (
    <Box
      sx={{
        bgcolor: esEmpresa ? "#e3f2fd" : "#fff3e0",
        px: 2,
        py: 1,
        borderRadius: 2,
        mt: 0.5,
        maxWidth: "100%",
      }}
    >
      <Box
        ref={contentRef}
        sx={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: expanded ? "none" : 3,
        }}
      >
        <Typography variant="body1">{contenido}</Typography>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        {new Date(fecha).toLocaleString()}
      </Typography>

      {isOverflowing && (
        <Button
          onClick={() => setExpanded((prev) => !prev)}
          size="small"
          sx={{
            mt: 1,
            textTransform: "none",
            fontSize: "0.8rem",
            color: "#0d47a1",
            fontWeight: 600,
          }}
        >
          {expanded ? "Ver menos" : "Ver más"}
        </Button>
      )}
    </Box>
  );
};

export default MensajeCortos;
