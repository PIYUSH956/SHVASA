import React from 'react';
import { Button, Box } from '@mui/material';
import Calendar from './Calendar';
import UserSearch from './UserSearch';

const Dashboard = ({ onLogout, user }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#f5f5f5' }}>
        <span>Welcome, {user.email}</span>
        <Button variant="contained" color="secondary" onClick={onLogout}>Logout</Button>
      </Box>
      <UserSearch />
      <Calendar user={user} />
    </Box>
  );
};

export default Dashboard;
