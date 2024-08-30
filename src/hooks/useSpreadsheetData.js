import { useState, useEffect, useMemo, useCallback } from 'react';
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

  // Memoize the setNewSpreadsheetData function
  const setNewSpreadsheetData = useCallback((data) => {
    setHeaders(Object.keys(data[0]));
    setSpreadsheetData(Object.values(data).map(Object.values));
  }, []);

  // Memoize the return values to prevent unnecessary re-renders
  return useMemo(
    () => ({
      spreadsheetData,
      setNewSpreadsheetData,
      headers,
      loading,
      error,
      setSpreadsheetData,
      setLoading,
      setError,
    }),
    [spreadsheetData, headers, loading, error, setNewSpreadsheetData]
  );
};

export default useSpreadsheetData;
