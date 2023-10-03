const mongoose = require('mongoose');

// Define el esquema del Ticket
const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true, //  código único
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now, // Para guardar la fecha y hora actual si no se proporciona
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

// Crea el modelo Ticket basado en el esquema
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
