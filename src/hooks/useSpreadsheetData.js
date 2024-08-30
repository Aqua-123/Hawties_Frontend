import { useState, useEffect } from 'react';
import apiClient from '../lib/api';

const useSpreadsheetData = (id) => {
  const [spreadsheetData, setSpreadsheetData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpreadsheet = async () => {
      setLoading(true);
      const result = await apiClient.fetchSpreadsheet(id);
      if (result.success) {
        const dataObject = result.data.data;
        setHeaders(Object.keys(dataObject[0]));
        setSpreadsheetData(Object.values(dataObject).map(Object.values));
      } else {
        setError(result.message);
      }
      setLoading(false);
    };

    fetchSpreadsheet();
  }, [id]);

  // set new screadsheet data but its format is same as the fetch data so it needs to be similarly handled
  const setNewSpreadsheetData = (data) => {
    setHeaders(Object.keys(data[0]));
    setSpreadsheetData(Object.values(data).map(Object.values));
  };

  return {
    spreadsheetData,
    setNewSpreadsheetData,
    headers,
    loading,
    error,
    setSpreadsheetData,
    setLoading,
    setError,
  };
};

export default useSpreadsheetData;
