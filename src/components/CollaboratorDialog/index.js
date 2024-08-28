import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@material-ui/core';

const CollaboratorDialog = ({
  open,
  onClose,
  onSubmit,
  collaboratorEmail,
  setCollaboratorEmail,
  collaboratorRole,
  setCollaboratorRole,
  isAdding = true,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{isAdding ? 'Add' : 'Remove'} Collaborator</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Collaborator Email"
        type="email"
        fullWidth
        value={collaboratorEmail}
        onChange={(e) => setCollaboratorEmail(e.target.value)}
      />
      {isAdding && (
        <TextField
          margin="dense"
          label="Role"
          type="text"
          fullWidth
          value={collaboratorRole}
          onChange={(e) => setCollaboratorRole(e.target.value)}
          select
          SelectProps={{ native: true }}
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </TextField>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onSubmit} color="primary">
        {isAdding ? 'Add' : 'Remove'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default CollaboratorDialog;
