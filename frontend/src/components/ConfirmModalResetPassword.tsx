import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Divider,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Props {
  open: boolean;
  nombre: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModalResetPassword = ({ open, nombre, onCancel, onConfirm }: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#fafafa",
          p: 3,
          maxWidth: 420,
          textAlign: "center",
        },
      }}
    >
      <Box display="flex" justifyContent="center" mb={2}>
        <WarningAmberIcon sx={{ fontSize: 50, color: "#f39c12" }} />
      </Box>

      <DialogTitle sx={{ fontWeight: 900, color: "#0d47a1" }}>
        Confirmar reseteo de contraseña
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: "text.secondary", mb: 2 }}>
          ¿Seguro que deseas resetear la contraseña de{" "}
          <strong>{nombre}</strong>? Se establecerá como{" "}
          <strong>123456</strong>.
        </DialogContentText>
        <Divider sx={{ my: 2 }} />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="inherit"
          startIcon={<CloseIcon />}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
          sx={{
            bgcolor: "#0d47a1",
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModalResetPassword;
