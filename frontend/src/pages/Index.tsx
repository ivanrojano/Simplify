import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Fade } from "@mui/material";
import type { JSX } from "react";

export const Index = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif",
        textAlign: "center",
        px: 2,
      }}
    >
      {/* Título principal */}
      <Fade in timeout={600}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            color: "#0d47a1",
            fontWeight: 800,
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
          }}
        >
          Simplify Servicios
        </Typography>
      </Fade>

      {/* Subtítulo */}
      <Fade in timeout={600}>
        <Typography
          component="p"
          gutterBottom
          sx={{
            color: "#0d47a1",
            fontWeight: 400,
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
          }}
        >
          Busca y solicita servicios ofrecidos por empresas
        </Typography>
      </Fade>

      {/* Botón Iniciar Sesión centrado */}
      <Fade in timeout={1000}>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0d47a1",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: 2,
              px: 4,
              py: 1.2,
              "&:hover": {
                backgroundColor: "#08306b",
              },
            }}
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Fade>
    </Box>
  );
};
