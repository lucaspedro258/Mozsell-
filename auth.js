const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashed
  });

  await user.save();
  res.send("Usuário criado");
});

// LOGIN
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Usuário não existe");

  const valid = await bcrypt.compare(req.body.password, user.password);

  if (!valid) return res.status(400).send("Senha inválida");

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET
  );

  res.json({ token, isAdmin: user.isAdmin });
});

module.exports = router;
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("Usuário já existe");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();

  res.send("Usuário criado com sucesso");
});
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET
);

res.json({ token });