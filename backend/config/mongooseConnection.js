require('dotenv').config();
const c = require('config');
const mongoose = require('mongoose');
const dbgr = require('debug')("development:mongoose");

const mongoURI = process.env.MONGODB_URI || c.get("MONGODB_URI");

mongoose.connect(mongoURI)
  .then(function() {
    console.log("Connected to MongoDB Atlas successfully!");
    dbgr("Connected to MongoDB Atlas");
  })
  .catch(function(err) {
    console.error("MongoDB connection error:", err);
    dbgr("MongoDB connection failed:", err);
  });

module.exports = mongoose.connection;
