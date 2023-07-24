const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import the uuid library to generate unique IDs

// Define the user schema
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: { type: String, required: true, unique: true, default: uuidv4 }, // Generate a unique ID using uuid
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('user', userSchema);
