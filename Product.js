const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  ownerId: String
});

module.exports = mongoose.model("Product", ProductSchema);
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String
});
