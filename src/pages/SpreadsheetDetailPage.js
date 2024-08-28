import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import axiosClient from "../axiosClient";
import Spreadsheet from "../components/Spreadsheet/Spreadsheet";
import { Typography, CircularProgress } from "@material-ui/core";

const SpreadsheetDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        openSpreadsheet(authUser.uid, id);
      } else {
        setUser(null);
        navigate("/signin");
      }
    });
    return unsubscribe;
  }, [navigate, id]);

  const openSpreadsheet = async (userId, spreadsheetId) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/api/spreadsheets/${userId}/${spreadsheetId}`
      );
      setCurrentData(response.data.data);
    } catch (error) {
      console.error("Error opening spreadsheet:", error);
      setError("Failed to open spreadsheet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (changes) => {
    if (user && id) {
      try {
        await axiosClient.patch(`/api/spreadsheet/update-spreadsheet`, {
          userId: user.uid,
          spreadsheetId: id,
          changes,
        });
      } catch (error) {
        console.error("Error saving spreadsheet data:", error);
        setError("Failed to save changes. Please try again.");
      }
    }
  };

  return (
    <div className="SpreadsheetDetailPage">
      <Typography variant="h4">Editing Spreadsheet</Typography>
      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      {!loading && !error && currentData && (
        <Spreadsheet data={currentData} onSave={handleSave} />
      )}
    </div>
  );
};

export default SpreadsheetDetailPage;
