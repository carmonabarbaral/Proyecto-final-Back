const { Schema, model } = require("mongoose");

const userSchema =Schema({
    name: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: Number,
    password: String,
    createdAt: Date,
    admin: {
      type: Boolean,
      default: false,
    },
    // Nuevo campo
    expirationDate: {
      type: Date,
    },
  });
  

module.exports = model('users', userSchema)
