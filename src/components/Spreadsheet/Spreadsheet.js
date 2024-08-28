import React, { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import io from "socket.io-client"; // Import socket.io client
import apiClient from "../../lib/api";
import {
  Button,
  CircularProgress,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { debounce } from "lodash";
import { useParams, useNavigate } from "react-router-dom";
import "./SpreadsheetPage.css";

const SpreadsheetPage = () => {
  const { id } = useParams();
  const hotTableRef = useRef(null);
  const [spreadsheetData, setSpreadsheetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [collaboratorRole, setCollaboratorRole] = useState("viewer");
  const [headers, setHeaders] = useState([]);
  const [isAddCollaboratorDialogOpen, setIsAddCollaboratorDialogOpen] =
    useState(false);
  const [isRemoveCollaboratorDialogOpen, setIsRemoveCollaboratorDialogOpen] =
    useState(false);
  const navigate = useNavigate();

  const socket = useRef(null); // Ref to store the socket connection

  useEffect(() => {
    // Establish socket connection
    socket.current = io("http://localhost:5000"); // Replace with your server URL

    socket.current.emit("joinSpreadsheet", id);

    socket.current.on("cellChanged", (data) => {
      const { changes } = data;
      const hotInstance = hotTableRef.current?.hotInstance;

      if (hotInstance) {
        changes.forEach(({ row, col, newValue }) => {
          hotInstance.setDataAtCell(row, col, newValue, "remoteChange");
        });
      }
    });

    return () => {
      socket.current.emit("leaveSpreadsheet", id);
      socket.current.disconnect();
    };
  }, [id]);

  useEffect(() => {
    const fetchSpreadsheet = async () => {
      setLoading(true);
      const result = await apiClient.fetchSpreadsheet(id);
      if (result.success) {
        const dataObject = result.data.data;

        // Extract headers (column names)
        const headers = Object.keys(dataObject[0]);

        // Extract row data (values only)
        const data = Object.values(dataObject).map(Object.values);

        // Set the spreadsheet data and headers separately
        setSpreadsheetData(data);
        setHeaders(headers);
      } else {
        setError(result.message);
      }
      setLoading(false);
    };

    fetchSpreadsheet();
  }, [id]);

  const debouncedSave = useRef(
    debounce(async (changes) => {
      if (changes.length > 0) {
        // Emit the change event to the server
        socket.current.emit("changeCell", {
          spreadsheetId: id,
          changes: changes.map(({ row, col, oldValue, newValue }) => ({
            row,
            col,
            oldValue,
            newValue,
          })),
        });

        // const result = await apiClient.saveSpreadsheetChanges(id, changes);
        // if (!result.success) {
        //   setError(result.message);
        // }
      }
    }, 1000)
  ).current;

  useEffect(() => {
    const hotInstance = hotTableRef.current?.hotInstance;

    const handleAutoSave = (changes, source) => {
      if (hotInstance && changes && source !== "remoteChange") {
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
      hotInstance.addHook("afterChange", (changes, source) => {
        if (source !== "loadData") {
          handleAutoSave(changes, source);
        }
      });
    }

    return () => {
      if (hotInstance && !hotInstance.isDestroyed) {
        hotInstance.removeHook("afterChange", handleAutoSave);
      }
    };
  }, [debouncedSave]);

  const handleImportCSV = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await apiClient.importData(id, formData);
        if (result.success) {
          // Assuming the result.data is in the format of an array of entries [[key, value], [key, value], ...]
          const formattedData = result.data.map(([key, value]) => value);
          setSpreadsheetData(formattedData);
          hotTableRef.current.hotInstance.loadData(formattedData);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to import CSV file.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSpreadsheet = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this spreadsheet?"
    );
    if (confirmDelete) {
      const result = await apiClient.deleteSpreadsheet(id);
      if (result.success) {
        navigate("/spreadsheets"); // Navigate back to the spreadsheets list after deletion
      } else {
        setError(result.message);
      }
    }
  };

  const handleAddCollaborator = async () => {
    const result = await apiClient.addCollaborator(
      id,
      collaboratorEmail,
      collaboratorRole
    );
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
      <div className="spreadsheet-controls">
        <Button variant="contained" component="label">
          Import CSV
          <input type="file" accept=".csv" hidden onChange={handleImportCSV} />
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDeleteSpreadsheet}
        >
          Delete Spreadsheet
        </Button>
        <Button
          variant="contained"
          onClick={() => setIsAddCollaboratorDialogOpen(true)}
        >
          Add Collaborator
        </Button>
        <Button
          variant="contained"
          onClick={() => setIsRemoveCollaboratorDialogOpen(true)}
        >
          Remove Collaborator
        </Button>
      </div>
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
          colHeaders={headers} // Pass headers separately as column headers
          rowHeaders={true}
          width="100%"
          height="600px"
          licenseKey="non-commercial-and-evaluation"
          contextMenu={true}
          manualRowResize={true}
          manualColumnResize={true}
          formulas={true}
          filters={true}
          dropdownMenu={true}
          columnSorting={true}
          autoRowSize={true}
          autoColumnSize={true}
          mergeCells={true}
          stretchH="all"
        />
      </div>

      {/* Add Collaborator Dialog */}
      <Dialog
        open={isAddCollaboratorDialogOpen}
        onClose={() => setIsAddCollaboratorDialogOpen(false)}
      >
        <DialogTitle>Add Collaborator</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsAddCollaboratorDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleAddCollaborator} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Collaborator Dialog */}
      <Dialog
        open={isRemoveCollaboratorDialogOpen}
        onClose={() => setIsRemoveCollaboratorDialogOpen(false)}
      >
        <DialogTitle>Remove Collaborator</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsRemoveCollaboratorDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleRemoveCollaborator} color="primary">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SpreadsheetPage;
