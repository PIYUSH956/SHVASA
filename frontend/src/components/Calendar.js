import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Dialog, TextField, Button } from '@mui/material';
import axios from 'axios';

const Calendar = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', startTime: '', tag: '', endTime: '' });
  const [errors, setError] = useState(null);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

 

  const getFormattedDate = (dayOffset) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const diff = (dayOffset - dayOfWeek + 7) % 7; 
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff); 

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(targetDate.getDate()).padStart(2, '0');

    return `${days[dayOffset]} ${year}-${month}-${day}`;
  };

  const adjustEndTime = (event) => {
    const eventEnd = new Date(event.endTime);
    const currentDate = new Date(event.startTime);
    
    if (eventEnd.getDate() !== currentDate.getDate()) {
      const now = new Date();
      
      now.setHours(23, 59, 59, 999); // Set the current date to 23:59:59.999
      event.endTime = now.toISOString(); // Update event.endTime
      console.log(event.name,event.endTime)
    }
    console.log(event.name,event.endTime)
    
    return event;
  };
  
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: { authorization: user.token },
        });
        
        const adjustedEvents = response.data.map(adjustEndTime);
        console.log(adjustedEvents)
        
        setEvents(adjustedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    fetchEvents();
  }, [user.token]);
  

  const handleAddEvent = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/events', newEvent, {
        headers: { authorization: user.token },
      });
      setEvents((prev) => [...prev, response.data]);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding event:', error);
      setError(error.response.data.error);
    }
  };

  // Helper function to calculate event duration in hours and minutes
  const getEventDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffInMs = endTime - startTime;
    return diffInMs / (1000 * 60 * 60); // Convert milliseconds to hours
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setDialogOpen(true)}>
        Add Event
      </Button>

      <Grid container spacing={1}>
        <Grid item xs={1}></Grid>
        {days.map((_, idx) => (
          <Grid item xs={1.5} key={_}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              {getFormattedDate(idx)}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={1}>
        <Grid item xs={1}>
          {hours.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: 60,
                borderTop: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2">{hour}</Typography>
            </Box>
          ))}
        </Grid>

        {days.map((_, dayIdx) => (
          <Grid item xs={1.5} key={_}>
            {hours.map((hour, hourIdx) => (
              <Box
                key={`${_}-${hour}`}
                sx={{
                  height: 60,
                  borderTop: '1px solid #ddd',
                  position: 'relative',
                }}
              >
                {events
                  .filter((event) => {
                    const eventDate = new Date(event.startTime || event.datetime);
                    const eventDayIndex = eventDate.getDay();
                    const eventHour = eventDate.getHours();
                    return eventDayIndex === dayIdx && eventHour === hourIdx;
                  })
                  .map((event, idx) => {
                    const eventDuration = getEventDuration(event.startTime, event.endTime);
                    const eventStartHour = new Date(event.startTime).getHours();
                    const eventEndHour = new Date(event.endTime).getHours();
                    const eventStartMinute = new Date(event.startTime).getMinutes();
                    const eventEndMinute = new Date(event.endTime).getMinutes();
                    console.log(eventEndHour,eventEndMinute,event,eventDuration)

                    // Calculate the width and position of the event based on start time and duration
                    const topOffset = ((eventStartHour + eventStartMinute / 60) - hourIdx) * 60;
                    const height = eventDuration < 1 ? 60 : eventDuration * 60; // Adjust height for short events

                    return (
                      <Box
                        key={idx}
                        sx={{
                          position: 'absolute',
                          top: topOffset,
                          left: 0,
                          right: 0,
                          height: height,
                          bgcolor: '#d1c4e9',
                          borderRadius: 1,
                          p: 1,
                          zIndex: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Typography variant="body2">{event.name}</Typography>
                      </Box>
                    );
                  })}
              </Box>
            ))}
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Box sx={{ p: 3, width: 400 }}>
          <Typography variant="h6" gutterBottom>
            Add New Event
          </Typography>
          <TextField
            fullWidth
            label="Event Name"
            sx={{ mb: 2 }}
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="Start Time"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={newEvent.startTime}
            onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="End Time"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={newEvent.endTime}
            onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
          />
          <TextField
            fullWidth
            label="Tag"
            sx={{ mb: 2 }}
            value={newEvent.tag}
            onChange={(e) => setNewEvent({ ...newEvent, tag: e.target.value })}
          />
          <Button variant="contained" fullWidth onClick={handleAddEvent}>
            Add Event
          </Button>
          {errors ? <p>{errors}</p> : <></>}
        </Box>
      </Dialog>
    </Box>
  );
};

export default Calendar;

