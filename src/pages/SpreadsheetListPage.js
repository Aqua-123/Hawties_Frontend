import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import axiosClient from "../axiosClient";
import { Button, Typography, CircularProgress } from "@material-ui/core";

const SpreadsheetListPage = () => {
  const [user, setUser] = useState(null);
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserSpreadsheets(authUser.uid);
      } else {
        setUser(null);
        navigate("/signin");
      }
    });
    return unsubscribe;
  }, [navigate]);

  const fetchUserSpreadsheets = async (userId) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/api/spreadsheets/${userId}`);
      setSpreadsheets(response.data);
    } catch (error) {
      setError("Failed to fetch spreadsheets.");
    } finally {
      setLoading(false);
    }
  };

  const createNewSpreadsheet = async () => {
    if (user) {
      try {
        setLoading(true);
        const response = await axiosClient.post(`/api/spreadsheets`, {
          userId: user.uid,
          name: "New Spreadsheet",
        });
        navigate(`/spreadsheets/${response.data.spreadsheetId}`);
      } catch (error) {
        console.error("Error creating new spreadsheet:", error);
        setError("Failed to create a new spreadsheet. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="SpreadsheetListPage">
      <Typography variant="h4">Google Sheets Replica</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={createNewSpreadsheet}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Create New Spreadsheet"}
      </Button>
      <Typography variant="h6">Your Spreadsheets</Typography>
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <ul>
        {spreadsheets.map(({ id, name }) => (
          <li key={id}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/spreadsheets/${id}`)}
              disabled={loading}
            >
              {name || `Spreadsheet ID: ${id}`}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpreadsheetListPage;
