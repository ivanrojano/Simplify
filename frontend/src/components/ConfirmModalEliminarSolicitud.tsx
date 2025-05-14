import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModalEliminarSolicitud: React.FC<Props> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 3 } }}
      BackdropProps={{ sx: { backgroundColor: "rgba(0, 0, 0, 0.3)" } }}
    >
      <DialogTitle>Eliminar solicitud</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="error" onClick={onConfirm}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModalEliminarSolicitud;
