import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import Header from '../Header';
import apiClient from '../../lib/api';
import { Box, Grid, Card, CardContent, Typography, IconButton, Avatar, Fab } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import './SpreadsheetsPage.css';
import image from './unnamed.png';

const SpreadsheetsPage = () => {
  const { user } = useContext(UserContext);
  const [newSpreadsheetName, setNewSpreadsheetName] = useState('Untitled spreadsheet');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateSpreadsheet = async () => {
    if (newSpreadsheetName.trim() === '') return;
    const result = await apiClient.createSpreadsheet(newSpreadsheetName);
    if (result.success) {
      user.ownedSpreadsheets.push(result.data); // Update user's owned spreadsheet list in context
      setNewSpreadsheetName('');
    } else {
      setError(result.message);
    }
  };

  const handleSpreadsheetClick = (id) => {
    navigate(`/spreadsheet/${id}`);
  };

  const renderSpreadsheetGrid = (spreadsheets) => (
    <Grid container spacing={3}>
      {spreadsheets.map((sheet) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={sheet._id}>
          <Card sx={{ cursor: 'pointer', boxShadow: 3 }} onClick={() => handleSpreadsheetClick(sheet._id)}>
            <Box sx={{ padding: '10px' }}>
              <img
                src={image} // Placeholder image for the thumbnail
                alt={sheet.name}
                style={{ width: '100%', borderRadius: '4px' }}
              />
            </Box>
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                {sheet.name || 'Untitled spreadsheet'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <Typography variant="caption" color="textSecondary">
                  Opened Aug 29, 2024 {/* Static date for now */}
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      <Header />
      <Box sx={{ padding: '20px' }}>
        <Typography variant="h5" sx={{ marginBottom: '20px', color: '#5f6368' }}>
          Owned Spreadsheets
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {user?.ownedSpreadsheets?.length > 0 ? (
          renderSpreadsheetGrid(user.ownedSpreadsheets)
        ) : (
          <Typography>No spreadsheets owned by you.</Typography>
        )}

        <Typography variant="h5" sx={{ marginTop: '40px', marginBottom: '20px', color: '#5f6368' }}>
          Shared with Me
        </Typography>
        {user?.sharedSpreadsheets?.length > 0 ? (
          renderSpreadsheetGrid(user.sharedSpreadsheets)
        ) : (
          <Typography>No spreadsheets shared with you.</Typography>
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            backgroundColor: '#4285F4',
            '&:hover': {
              backgroundColor: '#357ae8',
            },
          }}
          onClick={handleCreateSpreadsheet}
        >
          <AddIcon />
        </Fab>
      </Box>
    </>
  );
};

export default SpreadsheetsPage;
