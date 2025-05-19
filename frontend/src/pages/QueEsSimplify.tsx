import {
  Box,
  Typography,
  Container,
  Fade,
  IconButton,
  Divider,
  Button,
  Avatar,
  Rating,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BusinessIcon from "@mui/icons-material/Business";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SearchIcon from "@mui/icons-material/Search";
import StarRateIcon from "@mui/icons-material/StarRate";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SpeedIcon from "@mui/icons-material/Speed";
import ChatIcon from "@mui/icons-material/Chat";

import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import type { JSX } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export const QueEsSimplify = (): JSX.Element => {
  const navigate = useNavigate();

  const testimonialBoxStyle = {
    p: 3,
    border: "1px solid #e0e0e0",
    borderRadius: 3,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    bgcolor: "#fafafa",
    textAlign: "left",
  };

  const testimonialHeaderStyle = {
    display: "flex",
    alignItems: "center",
    mb: 1,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#ffffff",
        py: 8,
        px: 2,
        position: "relative",
      }}
    >
      {/* Botón de volver */}
      <Fade in timeout={600}>
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            color: "#0d47a1",
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Fade>

      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        {/* Título */}
        <Fade in timeout={600}>
          <Typography
            variant="h3"
            sx={{
              color: "#0d47a1",
              fontWeight: 800,
              mb: 2,
            }}
          >
            ¿Qué es Simplify Servicios?
          </Typography>
        </Fade>

        {/* Subtítulo con animación */}
        <Fade in timeout={800}>
          <Typography
            variant="h5"
            sx={{
              color: "#0d47a1",
              fontWeight: 600,
              mb: 3,
              minHeight: "2.5rem",
            }}
          >
            <Typewriter
              words={[
                "Conecta con empresas fácilmente",
                "Solicita servicios en segundos",
                "Gestiona todo desde un solo lugar",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={80}
              deleteSpeed={40}
              delaySpeed={1200}
            />
          </Typography>
        </Fade>

        {/* Explicación general */}
        <Fade in timeout={1000}>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.1rem",
              textAlign: "center",
              mb: 5,
              color: "#333",
            }}
          >
            Simplify es una plataforma que permite a los usuarios buscar y
            solicitar servicios ofrecidos por empresas de manera sencilla y
            rápida. También facilita la comunicación directa entre clientes y
            empresas a través de mensajería y seguimiento de solicitudes.
          </Typography>
        </Fade>

        {/* GIF ilustrativo */}
        <Fade in timeout={1200}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 5,
            }}
          >
            <img
              src="/foto-demostracion1.png"
              alt="Demostración animada de Simplify Servicios"
              style={{
                maxWidth: "100%",
                width: "100%",
                maxHeight: "360px",
                borderRadius: 16,
                boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                objectFit: "contain",
              }}
            />
          </Box>
        </Fade>

        <Divider sx={{ my: 6 }} />

        {/* Beneficios rápidos */}
        <Fade in timeout={3200}>
          <Typography
            variant="h4"
            sx={{
              color: "#0d47a1",
              fontWeight: 700,
              mb: 3,
              textAlign: "center",
            }}
          >
            ¿Por qué usar Simplify?
          </Typography>
        </Fade>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: 4,
            mt: 2,
          }}
        >
          <Fade in timeout={3400}>
            <Box textAlign="center" flex={1}>
              <EmojiEmotionsIcon sx={{ fontSize: 40, color: "#0d47a1" }} />
              <Typography fontWeight={600} mt={1}>
                Fácil y accesible
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Interfaz intuitiva y sin complicaciones.
              </Typography>
            </Box>
          </Fade>

          <Fade in timeout={3600}>
            <Box textAlign="center" flex={1}>
              <SpeedIcon sx={{ fontSize: 40, color: "#0d47a1" }} />
              <Typography fontWeight={600} mt={1}>
                Ahorra tiempo
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Encuentra y gestiona servicios en minutos.
              </Typography>
            </Box>
          </Fade>

          <Fade in timeout={3800}>
            <Box textAlign="center" flex={1}>
              <ChatIcon sx={{ fontSize: 40, color: "#0d47a1" }} />
              <Typography fontWeight={600} mt={1}>
                Comunicación directa
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Habla con las empresas desde la plataforma.
              </Typography>
            </Box>
          </Fade>
        </Box>


        <Divider sx={{ my: 5 }} />

        {/* Cómo funciona para Empresas */}
        <Fade in timeout={1400}>
          <Typography
            variant="h4"
            sx={{ color: "#0d47a1", fontWeight: 700, mb: 2 }}
          >
            ¿Cómo funciona para Empresas?
          </Typography>
        </Fade>

        <Typography variant="body1" sx={{ color: "#555", mb: 4 }}>
          Si tienes una empresa, estos son los pasos para comenzar a ofrecer tus servicios:
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <Fade in timeout={1600}>
            <Box textAlign="center" flex={1}>
              <PersonAddIcon sx={{ fontSize: 40, color: "#0d47a1" }} />
              <Typography fontWeight={600} mt={1}>
                1. Regístrate como empresa
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Crea una cuenta, añade tus datos y configura tu perfil.
              </Typography>
            </Box>
          </Fade>

          <Fade in timeout={1800}>
            <Box textAlign="center" flex={1}>
              <BusinessIcon sx={{ fontSize: 40, color: "#0d47a1" }} />
              <Typography fontWeight={600} mt={1}>
                2. Publica tus servicios
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Añade los servicios que ofreces y empieza a recibir solicitudes.
              </Typography>
            </Box>
          </Fade>

          <Fade in timeout={2000}>
            <Box textAlign="center" flex={1}>
              <DoneAllIcon sx={{ fontSize: 40, color: "#0d47a1" }} />
              <Typography fontWeight={600} mt={1}>
                3. Gestiona y responde
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Acepta, rechaza y finaliza solicitudes. Comunícate con tus clientes.
              </Typography>
            </Box>
          </Fade>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* Cómo funciona para Clientes */}
        <Fade in timeout={2200}>
          <Typography
            variant="h4"
            sx={{ color: "#0d47a1", fontWeight: 700, mb: 2 }}
          >
            ¿Cómo funciona para Clientes?
          </Typography>
        </Fade>

        <Typography variant="body1" sx={{ color: "#555", mb: 4 }}>
          Si eres cliente, así puedes encontrar y solicitar servicios fácilmente:
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <Fade in timeout={2400}>
            <Box textAlign="center" flex={1}>
              <PersonAddIcon sx={{ fontSize: 40, color: "#0d47a1" }} />
              <Typography fontWeight={600} mt={1}>
                1. Regístrate como cliente
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Crea tu cuenta y completa tus datos básicos.
              </Typography>
            </Box>
          </Fade>

          <Fade in timeout={2600}>
            <Box textAlign="center" flex={1}>
              <SearchIcon sx={{ fontSize: 40, color: "#0d47a1" }} />
              <Typography fontWeight={600} mt={1}>
                2. Busca y solicita servicios
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Explora empresas, revisa valoraciones y solicita lo que necesitas.
              </Typography>
            </Box>
          </Fade>

          <Fade in timeout={2800}>
            <Box textAlign="center" flex={1}>
              <StarRateIcon sx={{ fontSize: 40, color: "#0d47a1" }} />
              <Typography fontWeight={600} mt={1}>
                3. Recibe atención y valora
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Chatea con la empresa, recibe el servicio y deja tu valoración.
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Valoraciones de Clientes */}
        <Fade in timeout={4000}>
          <Typography
            variant="h6"
            sx={{ color: "#0d47a1", fontWeight: 600, mb: 3, textAlign: "center", mt: 3 }}
          >
            Opiniones reales de nuestros clientes
          </Typography>
        </Fade>


        <Fade in timeout={4200}>
          <Box sx={{ maxWidth: 700, mx: "auto", mb: 6 }}>
            <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1} autoplay autoplaySpeed={3000}>
              <Box sx={testimonialBoxStyle}>
                <Box sx={testimonialHeaderStyle}>
                  <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" sx={{ mr: 2 }} />
                  <Box>
                    <Typography fontWeight={600}>Ana López</Typography>
                    <Rating value={5} readOnly size="small" />
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Excelente plataforma, encontré un electricista de confianza en minutos. ¡Muy recomendada!
                </Typography>
              </Box>

              <Box sx={testimonialBoxStyle}>
                <Box sx={testimonialHeaderStyle}>
                  <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" sx={{ mr: 2 }} />
                  <Box>
                    <Typography fontWeight={600}>Carlos Méndez</Typography>
                    <Rating value={4} readOnly size="small" />
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Muy útil para coordinar con empresas. Me ahorró mucho tiempo en llamadas.
                </Typography>
              </Box>

              <Box sx={testimonialBoxStyle}>
                <Box sx={testimonialHeaderStyle}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ mr: 2 }} />
                  <Box>
                    <Typography fontWeight={600}>Lucía Ramírez</Typography>
                    <Rating value={5} readOnly size="small" />
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  La mensajería directa y la facilidad para calificar el servicio son geniales.
                </Typography>
              </Box>
            </Slider>
          </Box>
        </Fade>

        {/* Botón de acción */}
        <Fade in timeout={3000}>
          <Box sx={{ mt: 6 }}>
            <Button
              variant="contained"
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
                backgroundColor: "#0d47a1",
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "#08306b",
                },
              }}
              onClick={() => navigate("/registro")}
            >
              Comenzar ahora
            </Button>
          </Box>
        </Fade>


      </Container>
    </Box>
  );
};
