const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 3,
    maxlength: 55
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  }
});

UserSchema.plugin(timestamp);
const User = mongoose.model('User', UserSchema);
module.exports = User;
