import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const EventDialog = ({ open, onClose, onAddEvent }) => {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = () => {
    if (!name || !startTime || !endTime) {
      alert('Please fill in all fields.');
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      alert('End time must be after start time.');
      return;
    }

    onAddEvent({ name, startTime, endTime });
    setName('');
    setStartTime('');
    setEndTime('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Event</DialogTitle>
      <DialogContent>
        <TextField
          label="Event Name"
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Start Time"
          type="datetime-local"
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
          InputLabelProps={{ shrink: true }}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <TextField
          label="End Time"
          type="datetime-local"
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
          InputLabelProps={{ shrink: true }}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
