const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: { type: Number },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // New property
  role: {
    type: String,
    enum: ['admin', 'premium', 'user'],
    default: 'user',
  },

  // Existing field
  expirationDate: { type: Date },
});

module.exports = model('users', userSchema);