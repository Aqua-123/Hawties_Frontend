import React from 'react';
import { Button, Menu, MenuItem, IconButton, Divider, Tooltip } from '@material-ui/core';
import { ArrowDropDown, PersonAdd, Delete, CloudDownload } from '@material-ui/icons';
import { CloudUpload } from '@material-ui/icons';
import { useModalContext } from '../../contexts/ModalContext';

const importOptions = [
  { label: 'CSV', accept: '.csv' },
  { label: 'Excel (XLSX)', accept: '.xlsx' },
  { label: 'JSON', accept: '.json' },
  { label: 'Parquet', accept: '.parquet' },
  // Add more file types as needed
];

const SpreadsheetToolbar = ({ onImportFile, onDeleteSpreadsheet }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [importMenuEl, setImportMenuEl] = React.useState(null);
  const [downloadMenuEl, setDownloadMenuEl] = React.useState(null);

  const { setIsAddCollaboratorDialogOpen, setIsRemoveCollaboratorDialogOpen } = useModalContext(); // Use modal context

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleImportClick = (event) => {
    setImportMenuEl(event.currentTarget);
  };

  const handleDownloadClick = (event) => {
    setDownloadMenuEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setImportMenuEl(null);
    setDownloadMenuEl(null);
  };

  const handleFileChange = (event, fileType) => {
    onImportFile(event, fileType);
    handleMenuClose();
  };

  return (
    <div className="spreadsheet-toolbar" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Tooltip title="Import Options">
        <IconButton aria-controls="import-menu" aria-haspopup="true" onClick={handleImportClick} color="primary">
          <CloudUpload />
          <ArrowDropDown />
        </IconButton>
      </Tooltip>
      <Menu id="import-menu" anchorEl={importMenuEl} keepMounted open={Boolean(importMenuEl)} onClose={handleMenuClose}>
        {importOptions.map((option) => (
          <MenuItem key={option.label}>
            <input
              type="file"
              accept={option.accept}
              style={{ display: 'none' }}
              id={`import-${option.label}`}
              onChange={(e) => handleFileChange(e, option.label)}
            />
            <label htmlFor={`import-${option.label}`} style={{ width: '100%', cursor: 'pointer' }}>
              {option.label}
            </label>
          </MenuItem>
        ))}
      </Menu>

      <Tooltip title="Download Options">
        <IconButton aria-controls="download-menu" aria-haspopup="true" onClick={handleDownloadClick} color="primary">
          <CloudDownload />
          <ArrowDropDown />
        </IconButton>
      </Tooltip>
      <Menu
        id="download-menu"
        anchorEl={downloadMenuEl}
        keepMounted
        open={Boolean(downloadMenuEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Download as .csv</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download as .xlsx</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download as .pdf</MenuItem>
      </Menu>

      <Tooltip title="Collaborators">
        <IconButton aria-controls="collaborator-menu" aria-haspopup="true" onClick={handleMenuClick} color="primary">
          <PersonAdd />
          <ArrowDropDown />
        </IconButton>
      </Tooltip>
      <Menu id="collaborator-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => setIsAddCollaboratorDialogOpen(true)}>Add Collaborator</MenuItem>
        <MenuItem onClick={() => setIsRemoveCollaboratorDialogOpen(true)}>Remove Collaborator</MenuItem>
      </Menu>

      <Divider orientation="vertical" flexItem style={{ margin: '0 10px' }} />

      <Tooltip title="Delete Spreadsheet">
        <IconButton variant="contained" color="secondary" onClick={onDeleteSpreadsheet}>
          <Delete />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default SpreadsheetToolbar;
