import React, { useRef, useState, useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { CircularProgress, Typography } from '@material-ui/core';
import { useParams, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import io from 'socket.io-client';
import useSpreadsheetData from '../../hooks/useSpreadsheetData';
import CollaboratorDialog from '../CollaboratorDialog';
import SpreadsheetToolbar from '../SpreadsheetToolbar';
import apiClient from '../../lib/api';
import './SpreadsheetPage.css';

const SpreadsheetPage = () => {
  const { id } = useParams();
  const hotTableRef = useRef(null);
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const { spreadsheetData, headers, loading, error, setSpreadsheetData, setError, setLoading } = useSpreadsheetData(id);

  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaboratorRole, setCollaboratorRole] = useState('viewer');
  const [isAddCollaboratorDialogOpen, setIsAddCollaboratorDialogOpen] = useState(false);
  const [isRemoveCollaboratorDialogOpen, setIsRemoveCollaboratorDialogOpen] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.emit('joinSpreadsheet', id);

    socketRef.current.on('cellChanged', (data) => {
      const { changes } = data;
      const hotInstance = hotTableRef.current?.hotInstance;

      if (hotInstance) {
        changes.forEach(({ row, col, newValue }) => {
          hotInstance.setDataAtCell(row, col, newValue, 'remoteChange');
        });
      }
    });

    socketRef.current.on('rowAdded', ({ rowIndex }) => {
      const hotInstance = hotTableRef.current?.hotInstance;
      if (hotInstance) {
        hotInstance.alter('insert_row', rowIndex);
      }
    });

    socketRef.current.on('rowRemoved', ({ rowIndex }) => {
      const hotInstance = hotTableRef.current?.hotInstance;
      if (hotInstance) {
        hotInstance.alter('remove_row', rowIndex);
      }
    });

    socketRef.current.on('columnAdded', ({ colIndex }) => {
      const hotInstance = hotTableRef.current?.hotInstance;
      if (hotInstance) {
        hotInstance.alter('insert_col', colIndex);
      }
    });

    socketRef.current.on('columnRemoved', ({ colIndex }) => {
      const hotInstance = hotTableRef.current?.hotInstance;
      if (hotInstance) {
        hotInstance.alter('remove_col', colIndex);
      }
    });

    return () => {
      socketRef.current.emit('leaveSpreadsheet', id);
      socketRef.current.disconnect();
    };
  }, [id]);

  // Debounced save function
  const debouncedSave = useRef(
    debounce((changes) => {
      if (socketRef.current && changes.length > 0) {
        socketRef.current.emit('changeCell', {
          spreadsheetId: id,
          changes: changes.map(({ row, col, oldValue, newValue }) => ({ row, col, oldValue, newValue })),
        });
      }
    }, 1000)
  ).current;

  useEffect(() => {
    const hotInstance = hotTableRef.current?.hotInstance;

    const handleAutoSave = (changes, source) => {
      if (hotInstance && changes && source !== 'remoteChange') {
        const changeData = changes.map(([row, col, oldValue, newValue]) => ({
          row,
          col,
          oldValue,
          newValue,
        }));
        debouncedSave(changeData);
      }
    };

    if (hotInstance) {
      hotInstance.addHook('afterChange', (changes, source) => {
        if (source !== 'loadData') {
          handleAutoSave(changes, source);
        }
      });
    }

    return () => {
      if (hotInstance && !hotInstance.isDestroyed) {
        hotInstance.removeHook('afterChange', handleAutoSave);
      }
    };
  }, [debouncedSave]);

  const handleImportCSV = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const result = await apiClient.importData(id, formData);
        if (result.success) {
          const formattedData = result.data.map(([key, value]) => value);
          setSpreadsheetData(formattedData);
          hotTableRef.current.hotInstance.loadData(formattedData);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to import CSV file.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSpreadsheet = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this spreadsheet?');
    if (confirmDelete) {
      const result = await apiClient.deleteSpreadsheet(id);
      if (result.success) {
        navigate('/spreadsheets');
      } else {
        setError(result.message);
      }
    }
  };

  const handleAddCollaborator = async () => {
    const result = await apiClient.addCollaborator(id, collaboratorEmail, collaboratorRole);
    if (result.success) {
      setIsAddCollaboratorDialogOpen(false);
    } else {
      setError(result.message);
    }
  };

  const handleRemoveCollaborator = async () => {
    const result = await apiClient.removeCollaborator(id, collaboratorEmail);
    if (result.success) {
      setIsRemoveCollaboratorDialogOpen(false);
    } else {
      setError(result.message);
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
      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <div className="spreadsheet-container">
        <HotTable
          ref={hotTableRef}
          data={spreadsheetData}
          colHeaders={headers}
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
          autoRowSize={true}
          autoColumnSize={true}
          mergeCells={true}
          stretchH="all"
          // afterCreateRow={(index) => {
          //   socketRef.current.emit('addRow', { spreadsheetId: id, rowIndex: index });
          // }}
          // afterRemoveRow={(index, amount) => {
          //   socketRef.current.emit('removeRow', { spreadsheetId: id, rowIndex: index, amount });
          // }}
          // afterCreateCol={(index) => {
          //   socketRef.current.emit('addColumn', { spreadsheetId: id, colIndex: index });
          // }}
          // afterRemoveCol={(index, amount) => {
          //   socketRef.current.emit('removeColumn', { spreadsheetId: id, colIndex: index, amount });
          // }}
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
