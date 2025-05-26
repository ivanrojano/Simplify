import React from "react";
import { Box, Typography, IconButton, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const PoliticaPrivacidad: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        minHeight: "100vh",
        px: 2,
        py: 4,
        position: "relative",
      }}
    >
      {/* Botón volver */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ position: "absolute", top: 16, left: 16, color: "#0d47a1" }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" color="#0d47a1" gutterBottom>
          Política de Privacidad
        </Typography>

        <Typography variant="body1" paragraph>
          En <strong>Simplify Servicios</strong>, valoramos tu privacidad y nos
          comprometemos a proteger tus datos personales. Esta política explica
          cómo recopilamos, usamos y protegemos tu información.
        </Typography>

        <Section
          title="1. Información que recopilamos"
          content="Podemos recopilar información personal como tu nombre, correo electrónico, dirección IP, y otros datos proporcionados al registrarte o interactuar con nuestro sitio."
        />
        <Section
          title="2. Cómo usamos tu información"
          content="Usamos tu información para brindarte nuestros servicios, mejorar la experiencia del usuario, enviar comunicaciones importantes y cumplir con obligaciones legales."
        />
        <Section
          title="3. Protección de datos"
          content="Implementamos medidas de seguridad adecuadas para proteger tus datos personales contra el acceso no autorizado, pérdida o alteración."
        />
        <Section
          title="4. Tus derechos"
          content="Tienes derecho a acceder, rectificar o eliminar tus datos personales. Puedes contactarnos para ejercer estos derechos."
        />
        <Section
          title="5. Cambios en esta política"
          content="Nos reservamos el derecho de modificar esta política en cualquier momento. Te notificaremos cualquier cambio relevante a través de nuestros canales oficiales."
        />

        <Typography
          variant="body2"
          color="text.secondary"
          mt={4}
          textAlign="right"
        >
          Última actualización: 26 de mayo de 2025
        </Typography>
      </Container>
    </Box>
  );
};

const Section = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => (
  <Box mb={3}>
    <Typography variant="h6" fontWeight="bold" color="#0d47a1" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1">{content}</Typography>
  </Box>
);

export default PoliticaPrivacidad;
