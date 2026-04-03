const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  products: Array,
  total: Number,
  status: { type: String, default: "pendente" }
});

module.exports = mongoose.model("Order", OrderSchema);