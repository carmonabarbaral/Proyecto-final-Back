const express = require("express");
const ticketService = require("../services/TicketService");

const TicketController = class {
  constructor(ticketService) {
    this.ticketService = ticketService;
  }

  async createTicket(req, res) {
    const ticketData = req.body;
    const ticket = await this.ticketService.create(ticketData);
    res.status(201).json(ticket);
  }

  async findTicketById(req, res) {
    const id = req.params.id;
    const ticket = await this.ticketService.findById(id);
    if (!ticket) {
      res.status(404).send("Ticket not found");
    } else {
      res.status(200).json(ticket);
    }
  }

  async findAllTickets(req, res) {
    const tickets = await this.ticketService.findAll();
    res.status(200).json(tickets);
  }

  async findTicketsByPurchaser(req, res) {
    const purchaser = req.params.purchaser;
    const tickets = await this.ticketService.findByPurchaser(purchaser);
    res.status(200).json(tickets);
  }
};

module.exports = TicketController;