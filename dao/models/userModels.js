const { Schema, model } = require("mongoose");

const userSchema = Schema ({
    name: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    createdAt: Date,
    admin: {
        type: Boolean,
        default: false,
      }
})

module.exports = model('users', userSchema)
