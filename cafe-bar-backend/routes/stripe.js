const express = require("express");
const router = express.Router();
const stripeService = require("../services/stripeService");

router.post("/create-payment", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount) {
      return res.status(400).json({
        ok: false,
        message: "El campo amount es obligatorio"
      });
    }

    const resultado = await stripeService.crearPago(amount, currency);

    if (!resultado.ok) {
      return res.status(500).json(resultado);
    }

    return res.status(200).json(resultado);

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error en el servidor",
      error: error.message
    });
  }
});

module.exports = router;
