import React from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  confirmText: string;
  onConfirm: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, title, children, confirmText, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4, textAlign: 'center',
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="modal-title" variant="h6">{title}</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Box id="modal-description" mb={3}>{children}</Box>
        <Button variant="contained" color="primary" onClick={onConfirm}>{confirmText}</Button>
      </Box>
    </Modal>
  );
};

export default CustomModal;
