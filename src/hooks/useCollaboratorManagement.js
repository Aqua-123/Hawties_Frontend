import { useState } from 'react';
import apiClient from '../lib/api';

const useCollaboratorManagement = (spreadsheetId) => {
  const [error, setError] = useState(null);
  const [isAddCollaboratorDialogOpen, setIsAddCollaboratorDialogOpen] = useState(false);
  const [isRemoveCollaboratorDialogOpen, setIsRemoveCollaboratorDialogOpen] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaboratorRole, setCollaboratorRole] = useState('viewer');

  const handleAddCollaborator = async () => {
    try {
      const result = await apiClient.addCollaborator(spreadsheetId, collaboratorEmail, collaboratorRole);
      if (result.success) {
        setIsAddCollaboratorDialogOpen(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to add collaborator.');
    }
  };

  const handleRemoveCollaborator = async () => {
    try {
      const result = await apiClient.removeCollaborator(spreadsheetId, collaboratorEmail);
      if (result.success) {
        setIsRemoveCollaboratorDialogOpen(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to remove collaborator.');
    }
  };

  return {
    error,
    collaboratorEmail,
    setCollaboratorEmail,
    collaboratorRole,
    setCollaboratorRole,
    isAddCollaboratorDialogOpen,
    setIsAddCollaboratorDialogOpen,
    isRemoveCollaboratorDialogOpen,
    setIsRemoveCollaboratorDialogOpen,
    handleAddCollaborator,
    handleRemoveCollaborator,
  };
};

export default useCollaboratorManagement;
