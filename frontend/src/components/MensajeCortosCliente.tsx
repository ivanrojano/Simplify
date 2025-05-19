import { useState, useRef, useEffect } from "react";
import { Box, Typography, Button, Avatar, Stack } from "@mui/material";

interface Props {
  contenido: string;
  fecha: string;
  esEmisor: boolean;
  nombreEmisor: string;
  esEmpresa: boolean;
}

const MensajeCortosCliente: React.FC<Props> = ({
  contenido,
  fecha,
  esEmisor,
  nombreEmisor,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > 60);
    }
  }, [contenido]);

  const obtenerInicial = (nombre: string) => nombre?.charAt(0).toUpperCase() || "?";

  return (
    <Box
      sx={{
        maxWidth: "75%",
        display: "flex",
        flexDirection: "column",
        alignItems: esEmisor ? "flex-end" : "flex-start",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: esEmisor ? "#0d47a1" : "#6d4c41",
            fontSize: 14,
          }}
        >
          {obtenerInicial(nombreEmisor)}
        </Avatar>
        <Typography variant="caption" fontWeight={600}>
          {nombreEmisor}
        </Typography>
      </Stack>

      <Box
        ref={contentRef}
        sx={{
          backgroundColor: esEmisor ? "#e3f2fd" : "#fff3e0",
          px: 2,
          py: 1,
          borderRadius: 2,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: expanded ? "none" : 3,
          overflow: "hidden",
        }}
      >
        <Typography variant="body1">{contenido}</Typography>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
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

export default MensajeCortosCliente;
