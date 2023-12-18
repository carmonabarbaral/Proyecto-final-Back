const TicketService = class {
    constructor(ticketModel) {
      this.ticketModel = ticketModel;
    }
  
    async create(ticketData) {
      const ticket = new this.ticketModel(ticketData);
      await ticket.save();
      return ticket;
    }
  
    async findById(id) {
      const ticket = await this.ticketModel.findById(id);
      return ticket;
    }
  
    async findAll() {
      const tickets = await this.ticketModel.find();
      return tickets;
    }
  
    async findByPurchaser(purchaser) {
      const tickets = await this.ticketModel.find({ purchaser });
      return tickets;
    }
  };
  
  module.exports = TicketService;