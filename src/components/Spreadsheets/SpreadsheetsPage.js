import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../lib/api";
import "./SpreadsheetsPage.css";

const SpreadsheetsPage = () => {
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [newSpreadsheetName, setNewSpreadsheetName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiClient.fetchSpreadsheets();
      if (result.success) {
        setSpreadsheets(result.data);
      } else {
        setError(result.message);
      }
    };

    fetchData();
  }, []);

  const handleCreateSpreadsheet = async () => {
    if (newSpreadsheetName.trim() === "") return;
    const result = await apiClient.createSpreadsheet(newSpreadsheetName);
    if (result.success) {
      setSpreadsheets([...spreadsheets, result.data]);
      setNewSpreadsheetName("");
    } else {
      setError(result.message);
    }
  };

  const handleSpreadsheetClick = (id) => {
    navigate(`/spreadsheet/${id}`);
  };

  return (
    <div className="spreadsheets-container">
      <h2>My Spreadsheets</h2>
      {error && <p className="error-message">{error}</p>}
      <ul className="spreadsheet-list">
        {spreadsheets.map((sheet) => (
          <li
            key={sheet._id}
            className="spreadsheet-item"
            onClick={() => handleSpreadsheetClick(sheet._id)}
          >
            {sheet.name}
          </li>
        ))}
      </ul>
      <div className="create-spreadsheet">
        <input
          type="text"
          placeholder="New Spreadsheet Name"
          value={newSpreadsheetName}
          onChange={(e) => setNewSpreadsheetName(e.target.value)}
        />
        <button onClick={handleCreateSpreadsheet}>Create Spreadsheet</button>
      </div>
    </div>
  );
};

export default SpreadsheetsPage;
