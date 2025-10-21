
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    
    status: {
      type: String,
      enum: ['online', 'offline', 'away'],
      default: 'offline',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    
  },
  { timestamps: true } 
);

module.exports = mongoose.model('User', userSchema);
