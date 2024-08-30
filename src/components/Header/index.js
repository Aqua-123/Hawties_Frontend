import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Typography, InputBase, Avatar, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AppsIcon from '@mui/icons-material/Apps';
import { UserContext } from '../../contexts/UserContext';

const Header = () => {
  const { user } = useContext(UserContext);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#ffffff', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ marginRight: 2 }}>
          <MenuIcon sx={{ color: '#5f6368' }} />
        </IconButton>
        <img
          src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png"
          alt="Google Sheets"
          style={{ width: 32, marginRight: 8 }}
        />
        <Typography variant="h6" noWrap sx={{ color: '#5f6368', marginRight: 2 }}>
          Sheets
        </Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: '50px',
              backgroundColor: '#f1f3f4',
              '&:hover': { backgroundColor: '#e8eaed' },
              width: '100%',
              maxWidth: 600,
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
            }}
          >
            <SearchIcon sx={{ color: '#5f6368' }} />
            <InputBase
              placeholder="Search"
              sx={{
                color: '#5f6368',
                marginLeft: 1,
                flex: 1,
              }}
            />
          </Box>
        </Box>
        <IconButton edge="end" aria-label="apps">
          <AppsIcon sx={{ color: '#5f6368' }} />
        </IconButton>
        <IconButton edge="end" aria-label="account">
          <Avatar sx={{ marginLeft: 2 }} alt={user?.name || 'User'} src={user?.photoURL || ''}>
            {user?.name?.[0] || 'U'}
          </Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
