const CartsService = require("../services/cart.service");
const cartsService = new CartsService();
const PaymentsService = require("../services/payment.service");

class PaymentsController {
  constructor() {
    this.service = new PaymentsService();
  }

  async createPaymentIntent(req, res) {
    const user = req.user;
    try {
      const paymentIntent = await this.service.createPaymentIntent(user);
      return res.sendSuccess(200, paymentIntent);
    } catch (error) {
      return res.sendError(500, "Internal server error", error.message);
    }
  }

  async confirmPaymentIntent(req, res) {
    const { paymentIntentId } = req.body;
    const user = req.user;

    try {
      const paymentIntent = await this.service.confirmPaymentIntent(
        paymentIntentId
      );

      const productosSinSuficienteStock =
        paymentIntent.metadata.productosSinSuficienteStock || [];

      await cartsService.finishPurchase({
        amount: paymentIntent.amount,
        user,
        productosSinSuficienteStock,
      });

      return res.sendSuccess(200, "Successful payment");
    } catch (error) {
      res.sendError(500, "Internal Server error", error.message);
    }
  }

  async cancelPayment(req, res) {
    const { paymentIntentId } = req.body;
    try {
      await this.service.cancelPayment(paymentIntentId);
      return res.sendSuccess(200, "Successful payment cancellation");
    } catch (error) {
      res.sendError(500, "Internal Server error", error.message);
    }
  }
}

module.exports = PaymentsController;