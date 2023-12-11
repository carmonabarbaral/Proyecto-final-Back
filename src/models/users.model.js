const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  documents: [
    {
      name: String,
      reference: String
    }
  ],
  admin: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['admin', 'premium', 'user'],
    default: 'user',
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart",
  },
});

module.exports = mongoose.model("users", userSchema);