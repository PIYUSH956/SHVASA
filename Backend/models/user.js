const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleSyncEnabled: { type: Boolean, default: false },
  googleCalendarId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
