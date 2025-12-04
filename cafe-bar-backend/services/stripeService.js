const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_xxxxxxxx");

module.exports = {
  crearPago: async (amount, currency = "usd") => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        ok: true,
        clientSecret: paymentIntent.client_secret,
        message: "Intento de pago creado correctamente",
      };

    } catch (error) {
      return {
        ok: false,
        message: "Error creando pago con Stripe",
        error: error.message,
      };
    }
  }
};
