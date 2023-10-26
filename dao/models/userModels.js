const { Schema, model } = require("mongoose");

const userSchema = new Schema({
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
  // Nuevo campo
  role: {
    type: String,
    enum: ["admin", "premium", "user"],
    default: "admin",
  },
  // Campo existente
  expirationDate: {
    type: Date,
  },
});

module.exports = model('users', userSchema);