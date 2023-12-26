const PaymentsController = require("../controllers/paymentController");
const paymentsController = new PaymentsController();
const passportCall = require("../utils/passport.call");
const BaseRouter = require("./base.router");

class PaymentsRouter extends BaseRouter {
  init() {
    this.post(
      "/cancel-payment",
      paymentsController.cancelPayment.bind(paymentsController)
    );
    this.post(
      "/payment-intents",
      passportCall("jwt"),
      paymentsController.createPaymentIntent.bind(paymentsController)
    );
    this.post(
      "/confirm-payment-intent",
      passportCall("jwt"),
      paymentsController.confirmPaymentIntent.bind(paymentsController)
    );
  }
}

module.exports = PaymentsRouter;
