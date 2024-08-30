import React, { useRef, useState, useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { CircularProgress, Typography } from '@material-ui/core';
import { useParams, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import useSpreadsheetData from '../../hooks/useSpreadsheetData';
import useSpreadsheetSocket from '../../hooks/useSpreadsheetSocket';
import useCollaboratorManagement from '../../hooks/useCollaboratorManagement';
import CollaboratorDialog from '../CollaboratorDialog';
import SpreadsheetToolbar from '../SpreadsheetToolbar';
import apiClient from '../../lib/api';
import './SpreadsheetPage.css';

const SpreadsheetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotTableRef = useRef(null);
  const spreadsheetDataHook = useSpreadsheetData(id);

  const socketHook = useSpreadsheetSocket(id, hotTableRef);
  const {
    error: collaboratorError,
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
  } = useCollaboratorManagement(id);

  const debouncedSave = useRef(
    debounce((changes) => {
      if (!changes.length) return;
      socketHook.emitChangeCell(changes);
    }, 1000)
  ).current;

  useEffect(() => {
    const hotInstance = hotTableRef.current?.hotInstance;
    if (hotInstance) hotInstance.addHook('afterChange', handleAutoSave);
    return () => {
      if (hotInstance) hotInstance.removeHook('afterChange', handleAutoSave);
    };
  }, [debouncedSave]);

  const handleAutoSave = (changes, source) => {
    if (source !== 'remoteChange' && changes) {
      const changeData = changes.map(([row, col, oldValue, newValue]) => ({ row, col, oldValue, newValue }));
      debouncedSave(changeData);
    }
  };

  const handleImportCSV = async (event) => {
    const file = event.target.files[0];
    if (!file) return alert('No file selected.');
    spreadsheetDataHook.setLoading(true);
    try {
      const result = await apiClient.importData(id, file);
      if (result.success) {
        spreadsheetDataHook.setNewSpreadsheetData(result.data);
        return;
      }
      spreadsheetDataHook.setError(result.message);
    } catch (err) {
      spreadsheetDataHook.setError('Failed to import CSV file.');
    } finally {
      spreadsheetDataHook.setLoading(false);
    }
  };

  const handleDeleteSpreadsheet = async () => {
    if (!window.confirm('Are you sure you want to delete this spreadsheet?')) return;
    try {
      const result = await apiClient.deleteSpreadsheet(id);
      if (result.success) navigate('/spreadsheets');
      else spreadsheetDataHook.setError(result.message);
    } catch (err) {
      spreadsheetDataHook.setError('Failed to delete spreadsheet.');
    }
  };

  return (
    <div>
      <SpreadsheetToolbar
        onImportCSV={handleImportCSV}
        onDeleteSpreadsheet={handleDeleteSpreadsheet}
        onAddCollaborator={() => setIsAddCollaboratorDialogOpen(true)}
        onRemoveCollaborator={() => setIsRemoveCollaboratorDialogOpen(true)}
      />
      {spreadsheetDataHook.loading && <CircularProgress />}
      {(spreadsheetDataHook.error || collaboratorError) && (
        <Typography color="error" variant="body2">
          {spreadsheetDataHook.error || collaboratorError}
        </Typography>
      )}
      <div className="spreadsheet-container">
        <HotTable
          ref={hotTableRef}
          data={spreadsheetDataHook.spreadsheetData}
          colHeaders={spreadsheetDataHook.headers}
          rowHeaders={true}
          width="100%"
          height="600px"
          licenseKey="non-commercial-and-evaluation"
          contextMenu={true}
          manualRowResize={true}
          manualColumnResize={true}
          formulas={true}
          filters={true}
          multiColumnSorting={true}
          dropdownMenu={true}
          columnSorting={true}
          autoColumnSize={true}
          autoRowSize={false}
          mergeCells={true}
          stretchH="all"
          afterCreateRow={(index) => socketHook.emitAddRow(index)}
          afterRemoveRow={(index, amount) => socketHook.emitRemoveRow(index, amount)}
          afterCreateCol={(index) => socketHook.emitAddColumn(index)}
          afterRemoveCol={(index, amount) => socketHook.emitRemoveColumn(index, amount)}
        />
      </div>

      <CollaboratorDialog
        open={isAddCollaboratorDialogOpen}
        onClose={() => setIsAddCollaboratorDialogOpen(false)}
        onSubmit={handleAddCollaborator}
        collaboratorEmail={collaboratorEmail}
        setCollaboratorEmail={setCollaboratorEmail}
        collaboratorRole={collaboratorRole}
        setCollaboratorRole={setCollaboratorRole}
      />

      <CollaboratorDialog
        open={isRemoveCollaboratorDialogOpen}
        onClose={() => setIsRemoveCollaboratorDialogOpen(false)}
        onSubmit={handleRemoveCollaborator}
        collaboratorEmail={collaboratorEmail}
        setCollaboratorEmail={setCollaboratorEmail}
        isAdding={false}
      />
    </div>
  );
};

export default SpreadsheetPage;
