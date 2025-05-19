import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Fade } from "@mui/material";
import type { JSX } from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const Index = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <>
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
          position: "relative",
        }}
      >
        {/* Botón esquina superior derecha */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0d47a1",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.9rem",
              borderRadius: 2,
              px: 3,
              py: 1,
              "&:hover": {
                backgroundColor: "#08306b",
              },
            }}
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </Button>
        </Box>

        {/* Contenido principal centrado */}
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

        {/* Botón Saber Más */}
        <Fade in timeout={1000}>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              endIcon={
                <ArrowForwardIosIcon
                  sx={{ fontSize: "0.9rem", ml: 1 }}
                />
              }
              sx={{
                color: "#0d47a1",
                borderColor: "#0d47a1",
                px: 4,
                py: 1.2,
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: 3,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#0d47a111",
                  borderColor: "#08306b",
                  color: "#08306b",
                },
              }}
            onClick={() => navigate("/simplify")}
            >
              SABER MÁS
            </Button>
          </Box>
        </Fade>

      </Box>
    </>
  );
};
