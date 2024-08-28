import React from 'react';
import { Button, Menu, MenuItem, IconButton, Divider } from '@material-ui/core';
import { ArrowDropDown, PersonAdd, Delete } from '@material-ui/icons';
import { CloudDownload } from '@material-ui/icons';

import { CascadeSelect } from 'primereact/cascadeselect';

// Download cascade

const downloadOptions = [
  { label: '.csv', icon: 'pi pi-fw pi-file' },
  { label: '.xlsx', icon: 'pi pi-fw pi-file' },
  { label: '.txt', icon: 'pi pi-fw pi-file' },
  { label: 'Parquet', icon: 'pi pi-fw pi-file' },
  { label: 'JSON', icon: 'pi pi-fw pi-file' },
];

const importOptions = [
  { label: 'CSV', icon: 'pi pi-fw pi-file' },
  { label: 'Excel', icon: 'pi pi-fw pi-file' },
  { label: 'JSON', icon: 'pi pi-fw pi-file' },
  { label: 'Parquet', icon: 'pi pi-fw pi-file' },
];

const fileOptions = [
  { label: 'Download', items: downloadOptions },
  { label: 'Import', items: importOptions },
];

const SpreadsheetToolbar = ({ onImportCSV, onDeleteSpreadsheet, onAddCollaborator, onRemoveCollaborator }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [downloadMenuEl, setDownloadMenuEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDownloadClick = (event) => {
    setDownloadMenuEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setDownloadMenuEl(null);
  };

  return (
    <div className="spreadsheet-toolbar">
      <Button variant="contained" component="label">
        Import CSV
        <input type="file" accept=".csv" hidden onChange={onImportCSV} />
      </Button>

      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleDownloadClick}
        startIcon={<CloudDownload />}
        endIcon={<ArrowDropDown />}
      >
        Download
      </Button>
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

      <IconButton
        aria-controls="collaborator-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
        startIcon={<PersonAdd />}
      >
        Collaborators
        <ArrowDropDown />
      </IconButton>
      <Menu id="collaborator-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={onAddCollaborator}>Add Collaborator</MenuItem>
        <MenuItem onClick={onRemoveCollaborator}>Remove Collaborator</MenuItem>
      </Menu>

      <Divider orientation="vertical" flexItem />

      <Button variant="contained" color="secondary" onClick={onDeleteSpreadsheet} startIcon={<Delete />}>
        Delete Spreadsheet
      </Button>
    </div>
  );
};

export default SpreadsheetToolbar;
