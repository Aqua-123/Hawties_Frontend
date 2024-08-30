import apiClient from '../lib/api';

export const importCSV = async (id, file, setLoading, setSpreadsheetData, setError) => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('file', file);

    const result = await apiClient.importData(id, formData);
    if (result.success) {
      const formattedData = result.data.map(([key, value]) => value);
      setSpreadsheetData(formattedData);
      return formattedData;
    } else {
      setError(result.message);
    }
  } catch (err) {
    setError('Failed to import CSV file.');
  } finally {
    setLoading(false);
  }
};
