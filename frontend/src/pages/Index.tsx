import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Fade } from "@mui/material";
import { Typewriter } from "react-simple-typewriter";
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

      <Fade in timeout={1000}>
        <Typography
          component="div"
          sx={{
            color: "#0d47a1",
            fontWeight: 600,
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
            mb: 5,
            height: "3rem",
          }}
        >
          <Typewriter
            words={[
              "Rápido de Contactar",
              "Fácil de Usar",
              "Gestión Simplificada",
              "Todo en un Solo Lugar",
              "Ahorra Tiempo",
              "Organiza tus Servicios",
              "Soporte Profesional",
              "Interfaz Intuitiva",
              "Acceso desde Cualquier Lugar",
              "Experiencia Fluida",
            ]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={100}
            deleteSpeed={40}
            delaySpeed={1000}
          />
        </Typography>
      </Fade>

      <Fade in timeout={1300}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0d47a1",
              color: "#fff",
              px: 4,
              py: 1.2,
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: 3,
              "&:hover": {
                backgroundColor: "#08306b",
              },
            }}
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: "#0d47a1",
              borderColor: "#0d47a1",
              px: 4,
              py: 1.2,
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: 3,
              "&:hover": {
                backgroundColor: "#0d47a111",
                borderColor: "#08306b",
                color: "#08306b",
              },
            }}
            onClick={() => navigate("/registro")}
          >
            Registrarse
          </Button>
        </Box>
      </Fade>
    </Box>
  );
};
