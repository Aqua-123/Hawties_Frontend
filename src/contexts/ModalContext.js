import React, { createContext, useState, useContext } from 'react';
import CustomModal from '../components/CustomModal';
import { TextField } from '@material-ui/core';

const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
  const [isAddCollaboratorDialogOpen, setIsAddCollaboratorDialogOpen] = useState(false);
  const [isRemoveCollaboratorDialogOpen, setIsRemoveCollaboratorDialogOpen] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaboratorRole, setCollaboratorRole] = useState('viewer');

  return (
    <ModalContext.Provider
      value={{
        isAddCollaboratorDialogOpen,
        setIsAddCollaboratorDialogOpen,
        isRemoveCollaboratorDialogOpen,
        setIsRemoveCollaboratorDialogOpen,
        collaboratorEmail,
        setCollaboratorEmail,
        collaboratorRole,
        setCollaboratorRole,
      }}
    >
      {children}

      {/* Add Collaborator Modal */}
      <CustomModal
        isOpen={isAddCollaboratorDialogOpen}
        onClose={() => setIsAddCollaboratorDialogOpen(false)}
        title="Add Collaborator"
        onSubmit={() => {
          // handleAddCollaborator logic here
          setIsAddCollaboratorDialogOpen(false);
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          label="Collaborator Email"
          type="email"
          fullWidth
          value={collaboratorEmail}
          onChange={(e) => setCollaboratorEmail(e.target.value)}
        />
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
      </CustomModal>

      {/* Remove Collaborator Modal */}
      <CustomModal
        isOpen={isRemoveCollaboratorDialogOpen}
        onClose={() => setIsRemoveCollaboratorDialogOpen(false)}
        title="Remove Collaborator"
        onSubmit={() => {
          // handleRemoveCollaborator logic here
          setIsRemoveCollaboratorDialogOpen(false);
        }}
        submitLabel="Remove"
      >
        <TextField
          autoFocus
          margin="dense"
          label="Collaborator Email"
          type="email"
          fullWidth
          value={collaboratorEmail}
          onChange={(e) => setCollaboratorEmail(e.target.value)}
        />
      </CustomModal>
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
