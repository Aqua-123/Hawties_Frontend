import React, { useRef, useEffect, useCallback } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { CircularProgress, Typography } from '@material-ui/core';
import { useParams, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import useSpreadsheetData from '../../hooks/useSpreadsheetData';
import useSpreadsheetSocket from '../../hooks/useSpreadsheetSocket';
import SpreadsheetToolbar from '../SpreadsheetToolbar';
import apiClient from '../../lib/api';
import './SpreadsheetPage.css';
import { ModalContextProvider } from '../../contexts/ModalContext';

const MemoizedHotTable = React.memo(HotTable);

const SpreadsheetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotTableRef = useRef(null);
  const spreadsheetDataHook = useSpreadsheetData(id);

  const socketHook = useSpreadsheetSocket(id, hotTableRef);

  const debouncedSave = useRef(
    debounce((changes) => {
      if (!changes.length) return;
      socketHook.emitChangeCell(changes);
    }, 1000)
  ).current;

  const handleAutoSave = useCallback(
    (changes, source) => {
      if (source !== 'remoteChange' && changes) {
        const changeData = changes.map(([row, col, oldValue, newValue]) => ({
          row,
          col,
          oldValue,
          newValue,
        }));
        debouncedSave(changeData);
      }
    },
    [debouncedSave]
  );

  useEffect(() => {
    const hotInstance = hotTableRef.current?.hotInstance;

    if (hotInstance) {
      hotInstance.addHook('afterChange', handleAutoSave);
    }

    return () => {
      if (hotInstance) {
        if (!hotInstance.isDestroyed) {
          hotInstance.removeHook('afterChange', handleAutoSave);
        }
      }
      debouncedSave.cancel();
    };
  }, [handleAutoSave, debouncedSave]);

  const handleImportCSV = async (event) => {
    const file = event.target.files[0];
    if (!file) return alert('No file selected.');
    spreadsheetDataHook.setLoading(true);
    try {
      const result = await apiClient.importData(id, file);
      console.log(result);
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
    <ModalContextProvider>
      <div className="container">
        <SpreadsheetToolbar onImportFile={handleImportCSV} onDeleteSpreadsheet={handleDeleteSpreadsheet} />
        {spreadsheetDataHook.loading && <CircularProgress />}
        {spreadsheetDataHook.error && (
          <Typography color="error" variant="body2">
            {spreadsheetDataHook.error}
          </Typography>
        )}
        <div className="spreadsheet-container">
          <MemoizedHotTable
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
            viewportColumnRenderingOffset={10}
            viewportRowRenderingOffset={20}
            afterCreateRow={(index) => socketHook.emitAddRow(index)}
            afterRemoveRow={(index, amount) => socketHook.emitRemoveRow(index, amount)}
            afterCreateCol={(index) => socketHook.emitAddColumn(index)}
            afterRemoveCol={(index, amount) => socketHook.emitRemoveColumn(index, amount)}
          />
        </div>
      </div>
    </ModalContextProvider>
  );
};

export default SpreadsheetPage;
