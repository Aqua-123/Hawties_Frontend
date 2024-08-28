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

  return {
    spreadsheetData,
    headers,
    loading,
    error,
    setSpreadsheetData,
    setLoading,
    setError,
  };
};

export default useSpreadsheetData;
