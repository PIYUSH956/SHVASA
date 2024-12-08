import React, { useState } from 'react';
import { TextField, Box, List, ListItem } from '@mui/material';

const UserSearch = () => {
  const [search, setSearch] = useState('');
  const [users] = useState([]);

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label="Search Users"
        fullWidth
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <List>
        {users
          .filter((user) => user.email.includes(search))
          .map((user, index) => (
            <ListItem key={index}>{user.email}</ListItem>
          ))}
      </List>
    </Box>
  );
};

export default UserSearch;
