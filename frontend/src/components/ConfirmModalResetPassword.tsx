import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface Props {
  open: boolean;
  nombre: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModalResetPassword = ({ open, nombre, onCancel, onConfirm }: Props) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirmar reseteo de contraseña</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Seguro que deseas resetear la contraseña de <strong>{nombre}</strong>? Se establecerá como <strong>123456</strong>.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModalResetPassword;
