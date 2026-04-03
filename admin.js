module.exports = function(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).send("Acesso negado");
  }
  next();
};
async function addProduct() {
  const token = localStorage.getItem("token");

  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    image: document.getElementById("image").value
  };

  await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(product)
  });

  alert("Produto adicionado!");
  loadProducts();
}