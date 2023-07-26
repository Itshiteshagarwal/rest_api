const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 


const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: { type: String, required: true, unique: true, default: uuidv4 }, 
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('user', userSchema);
