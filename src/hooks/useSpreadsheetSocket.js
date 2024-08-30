import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useSpreadsheetSocket = (id, hotTableRef) => {
  const socketRef = useRef(null);

  useEffect(() => {
    initializeSocketConnection();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leaveSpreadsheet', id);
        socketRef.current.disconnect();
      }
    };
  }, [id]);

  const initializeSocketConnection = () => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('joinSpreadsheet', id);

    socketRef.current.on('cellChanged', handleRemoteCellChange);
    socketRef.current.on('rowAdded', handleRemoteRowAdded);
    socketRef.current.on('rowRemoved', handleRemoteRowRemoved);
    socketRef.current.on('columnAdded', handleRemoteColumnAdded);
    socketRef.current.on('columnRemoved', handleRemoteColumnRemoved);
  };

  const handleRemoteCellChange = ({ changes }) => {
    const hotInstance = hotTableRef.current?.hotInstance;
    if (hotInstance) {
      changes.forEach(({ row, col, newValue }) => {
        hotInstance.setDataAtCell(row, col, newValue, 'remoteChange');
      });
    }
  };

  const handleRemoteRowAdded = ({ rowIndex }) => {
    const hotInstance = hotTableRef.current?.hotInstance;
    if (hotInstance) {
      hotInstance.alter('insert_row', rowIndex);
    }
  };

  const handleRemoteRowRemoved = ({ rowIndex }) => {
    const hotInstance = hotTableRef.current?.hotInstance;
    if (hotInstance) {
      hotInstance.alter('remove_row', rowIndex);
    }
  };

  const handleRemoteColumnAdded = ({ colIndex }) => {
    const hotInstance = hotTableRef.current?.hotInstance;
    if (hotInstance) {
      hotInstance.alter('insert_col', colIndex);
    }
  };

  const handleRemoteColumnRemoved = ({ colIndex }) => {
    const hotInstance = hotTableRef.current?.hotInstance;
    if (hotInstance) {
      hotInstance.alter('remove_col', colIndex);
    }
  };

  const emitAddRow = (index) => {
    socketRef.current.emit('addRow', { spreadsheetId: id, rowIndex: index });
  };

  const emitRemoveRow = (index, amount) => {
    socketRef.current.emit('removeRow', { spreadsheetId: id, rowIndex: index, amount });
  };

  const emitAddColumn = (index) => {
    socketRef.current.emit('addColumn', { spreadsheetId: id, colIndex: index });
  };

  const emitRemoveColumn = (index, amount) => {
    socketRef.current.emit('removeColumn', { spreadsheetId: id, colIndex: index, amount });
  };

  const emitChangeCell = (changes) => {
    socketRef.current.emit('changeCell', {
      spreadsheetId: id,
      changes: changes.map(({ row, col, oldValue, newValue }) => ({ row, col, oldValue, newValue })),
    });
  };

  return {
    emitAddRow,
    emitRemoveRow,
    emitAddColumn,
    emitRemoveColumn,
    emitChangeCell,
  };
};

export default useSpreadsheetSocket;
