const express = require('express');
const { createEvent, listEvents } = require('../controllers/eventController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createEvent);
router.get('/', authMiddleware, listEvents);

module.exports = router;
