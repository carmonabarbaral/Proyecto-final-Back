const Ticket = require('../dao/models/ticketModels');  
async function createTicket(amount, purchaser) {
  try {
    const newTicket = new Ticket({
      code: generateTicketCode(), // Deberías tener una función para generar códigos automáticamente
      amount: amount,
      purchaser: purchaser,
    });

    const savedTicket = await newTicket.save();
    console.log('Ticket creado:', savedTicket);
    return savedTicket;
  } catch (error) {
    console.error('Error al crear el Ticket:', error);
    throw error;
  }
}

// Agrega aquí la lógica para generar códigos de ticket si es necesario
function generateTicketCode() {
  // Implementa tu lógica para generar códigos de ticket aquí
  // Puedes usar bibliotecas como 'uuid' para generar identificadores únicos
}

module.exports = {
  createTicket,
};
