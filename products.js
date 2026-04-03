const router = require("express").Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// CRIAR PRODUTO (apenas logado)
router.post("/", auth, async (req, res) => {
  const product = new Product({
    ...req.body,
    ownerId: req.user.id
  });

  await product.save();
  res.send("Produto criado");
});

// LISTAR PRODUTOS
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;
const router = require("express").Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// criar produto
router.post("/", auth, admin, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.send("Produto criado");
});

// listar produtos
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// deletar produto
router.delete("/:id", auth, admin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send("Produto removido");
});

module.exports = router;
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// criar produto com imagem
router.post("/", auth, upload.single("image"), async (req, res) => {

  let imageUrl = "";

  if (req.file) {
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      async (error, result) => {
        if (result) imageUrl = result.secure_url;
      }
    );

    result.end(req.file.buffer);
  }

  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    image: imageUrl,
    ownerId: req.user.id
  });

  await product.save();

  res.send("Produto criado com imagem");
});
router.get("/my", auth, async (req, res) => {
  const products = await Product.find({ ownerId: req.user.id });
  res.json(products);
});