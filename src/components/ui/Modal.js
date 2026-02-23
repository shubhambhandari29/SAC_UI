import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material';
import { MdClear } from 'react-icons/md';

export default function Modal({
  open,
  onClose,
  title = '',
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  hideCloseIcon = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{ sx: { borderRadius: '15px' } }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} component={'div'}>
        {title && <Typography variant="h6">{title}</Typography>}
        {!hideCloseIcon && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <MdClear />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers={title !== ''}>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}

// usage
/* <Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Action"
  actions={
    <>
      <Button onClick={() => setOpen(false)} color="inherit">
        Cancel
      </Button>
      <Button
        onClick={() => {
          // Do something
          setOpen(false);
        }}
        variant="contained"
        color="primary"
      >
        Confirm
      </Button>
    </>
  }
>
  <p>This action cannot be undone. Are you sure you want to continue?</p>
</Modal>; */
