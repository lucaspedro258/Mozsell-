const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Servidor rodando 🚀"));
app.use("/api/products", require("./routes/product"));