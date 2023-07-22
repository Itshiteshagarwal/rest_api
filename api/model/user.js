const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username:String,
    email:String,
    password:String,
})

module.exports = mongoose.model('user', userschema);