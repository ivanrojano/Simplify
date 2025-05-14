import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Fade,
  keyframes,
} from "@mui/material";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
`;

export const InicioRegistro = () => {
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
        px: 2,
        textAlign: "center",
        position: "relative",
      }}
    >
      <Fade in timeout={800}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ position: "absolute", top: 16, left: 16, color: "#0d47a1" }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Fade>

      <Fade in timeout={800}>
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          onClick={() => navigate("/")}
          sx={{
            width: 120,
            animation: `${pulse} 2.5s ease-in-out infinite`,
            mb: 2,
            cursor: "pointer",
          }}
        />
      </Fade>

      <Fade in timeout={1000}>
        <Typography
          variant="h4"
          color="#0d47a1"
          fontWeight={700}
          gutterBottom
          sx={{ mb: 2 }}
        >
          Elige tipo de registro
        </Typography>
      </Fade>

      <Fade in timeout={1200}>
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0d47a1",
              px: 5,
              py: 1.6,
              fontWeight: 600,
              fontSize: "1.05rem",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#08306b",
                transform: "translateY(-1px)",
              },
            }}
            onClick={() => navigate("/registro/cliente")}
          >
            Registrarse como Cliente
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0d47a1",
              px: 5,
              py: 1.6,
              fontWeight: 600,
              fontSize: "1.05rem",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#08306b",
                transform: "translateY(-1px)",
              },
            }}
            onClick={() => navigate("/registro/empresa")}
          >
            Registrarse como Empresa
          </Button>
        </Box>
      </Fade>
    </Box>
  );
};
