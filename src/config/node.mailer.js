const settings = require("../command/command");

const nodemailer = require("nodemailer");
const transportGmail = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: settings.emailUser,
    pass: settings.passUser,
  },
});

module.exports = { transportGmail };