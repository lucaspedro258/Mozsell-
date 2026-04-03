const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const order = new Order({
    userId: req.user.id,
    products: req.body.products,
    total: req.body.total
  });

  await order.save();

  res.send("Pedido criado");
});

module.exports = router;