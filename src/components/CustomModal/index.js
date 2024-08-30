import React from 'react';
import { IconButton, Button } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import './CustomModal.css';

const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{title}</h2>
          <IconButton onClick={onClose} className="close-button">
            <CloseIcon />
          </IconButton>
        </div>
        <div className="modal-content">{children}</div>
        <div className="modal-actions">
          <Button variant="outlined" color="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
