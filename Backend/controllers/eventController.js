const Event = require('../models/Event');


const validateTimeFrame = (startTime,endTime) => {
 

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false
  }

  if (end <= start) {
    return false
  }

  return true
};



exports.createEvent = async (req, res) => {
  const { name, startTime, endTime, tag } = req.body;
  console.log(req.body)

  if(validateTimeFrame(startTime,endTime) == false) return res.status(400).json({"Error":"Wrong Time Format"})

  const userId = req.userId;
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (end <= start) {
    return res.status(400).json({ error: 'End time must be after start time' });
  }

  try {
    // Check for time conflicts
    const conflictingEvent = await Event.findOne({
      userId,
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }, // Overlaps with an existing event
      ],
    });

    if (conflictingEvent) {
      return res.status(400).json({ error: 'Time slot is occupied by another event' });
    }

    // Create the event
    const newEvent = await Event.create({ name, startTime: start, endTime: end, tag, userId });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};








exports.listEvents = async (req, res) => {
  const { filter, sort, limit } = req.query;
  const userId = req.userId;
 

  try {
    const events = await Event.find({ userId })
      .sort(sort || {})
      .limit(Number(limit) || 10)
      .exec();
    res.json(events);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};
