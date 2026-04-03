document.querySelector("#registerForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  console.log("REGISTO:", { name, email, password });

  alert("Conta criada (modo simulação)");
});

document.querySelector("#loginForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  console.log("LOGIN:", { email, password });

  alert("Login feito (modo simulação)");
});
function toggleMenu() {
  document.querySelector("nav").classList.toggle("active");
}
document.querySelector("#productForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const product = {
    title: document.querySelector("#title").value,
    price: document.querySelector("#price").value,
    image: document.querySelector("#image").value,
    description: document.querySelector("#description").value
  };

  let products = JSON.parse(localStorage.getItem("products")) || [];

  products.push(product);

  localStorage.setItem("products", JSON.stringify(products));

  alert("Produto adicionado!");

  loadProducts();
});
function loadProducts() {
  const list = document.getElementById("productList");

  if (!list) return;

  list.innerHTML = "";

  let products = JSON.parse(localStorage.getItem("products")) || [];

  products.forEach((p, index) => {
    list.innerHTML += `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <strong>${p.price} MZN</strong>
        <br>
        <button onclick="deleteProduct(${index})">Remover</button>
      </div>
    `;
  });

}
function deleteProduct(index) {
  let products = JSON.parse(localStorage.getItem("products")) || [];

  products.splice(index, 1);

  localStorage.setItem("products", JSON.stringify(products));

  loadProducts();
}
function loadHomeProducts() {
  const container = document.getElementById("productsHome");

  if (!container) return;

  let products = JSON.parse(localStorage.getItem("products")) || [];

  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <strong>${p.price} MZN</strong>
      </div>
    `;
  });
}

window.onload = function() {
  loadProducts();
  loadHomeProducts();
};
document.querySelector("#loginForm")?.addEventListener("submit", async e => {
  e.preventDefault();

  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();

  localStorage.setItem("token", data.token);

  if (data.isAdmin) {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
});
document.querySelector("#productForm")?.addEventListener("submit", async e => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      title: title.value,
      price: price.value,
      description: description.value
    })
  });

  alert("Produto criado!");
});
async function loadProducts() {
  const res = await fetch("http://localhost:5000/api/products");
  const products = await res.json();

  const container = document.getElementById("productsHome");

  container.innerHTML = "";
container.innerHTML += `
  <div class="card">
    <h3>${p.title}</h3>
    <p>${p.description}</p>
    <strong>${p.price} MZN</strong>
    <button onclick='addToCart(${JSON.stringify(p)})'>
      Adicionar ao carrinho
    </button>
  </div>
`;
  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <strong>${p.price} MZN</strong>
      </div>
    `;
  });
}
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Produto adicionado ao carrinho!");
}
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cartItems");

  let total = 0;

  container.innerHTML = "";

  cart.forEach(item => {
    total += Number(item.price);

    container.innerHTML += `
      <div>
        ${item.title} - ${item.price} MZN
      </div>
    `;
  });

  document.getElementById("total").innerText = "Total: " + total + " MZN";
}

window.onload = loadCart;
async function checkout() {
  const token = localStorage.getItem("token");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce((sum, p) => sum + Number(p.price), 0);

  await fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ products: cart, total })
  });

  alert("Pedido realizado!");
  localStorage.removeItem("cart");
}
function loadProfile() {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/auth/me", {
    headers: { "Authorization": token }
  })
  .then(res => res.json())
  .then(user => {
    document.getElementById("userInfo").innerHTML = `
      Nome: ${user.name} <br>
      Email: ${user.email}
    `;
  });
}
status: {
  String, "aguardando pagamento"
}
function togglePassword() {
  const pass = document.getElementById("password");
  const eye = document.getElementById("eye");

  if (pass.type === "password") {
    pass.type = "text";
    eye.textContent = "🙈";
  } else {
    pass.type = "password";
    eye.textContent = "👁️";
  }
}
document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const errorMsg = document.getElementById("errorMsg");

  if (!email || !password) {
    errorMsg.textContent = "Preencha todos os campos!";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      errorMsg.textContent = "Email ou senha inválidos!";
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);

    window.location.href = "index.html";

  } catch (err) {
    errorMsg.textContent = "Erro no servidor!";
  }
});
function setLoading(state) {
  const btnText = document.getElementById("btnText");
  const loader = document.getElementById("loader");

  if (state) {
    btnText.style.display = "none";
    loader.style.display = "inline";
  } else {
    btnText.style.display = "inline";
    loader.style.display = "none";
  }
}
function togglePassword(id) {
  const input = document.getElementById(id);

  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}
function setLoading(state) {
  const btnText = document.getElementById("btnText");
  const loader = document.getElementById("loader");

  if (state) {
    btnText.style.display = "none";
    loader.style.display = "inline";
  } else {
    btnText.style.display = "inline";
    loader.style.display = "none";
  }
}
document.getElementById("registerForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorMsg = document.getElementById("errorMsg");

  errorMsg.textContent = "";

  if (!name || !email || !password) {
    errorMsg.textContent = "Preencha todos os campos!";
    return;
  }

  if (password !== confirmPassword) {
    errorMsg.textContent = "As senhas não coincidem!";
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, email, password })
    });

    setLoading(false);

    if (!res.ok) {
      errorMsg.textContent = "Erro ao criar conta!";
      return;
    }
const data = await res.json();

// guarda token (login automático)
localStorage.setItem("token", data.token);

// vai para home
window.location.href = "index.html";
    window.location.href = "login.html";

  } catch (err) {
    setLoading(false);
    errorMsg.textContent = "Erro no servidor!";
  }
});
async function loadProducts() {
  const res = await fetch("http://localhost:5000/api/products");
  const products = await res.json();

  const container = document.getElementById("productList");

  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div>
        <h4>${p.title}</h4>
        <p>${p.price} MZN</p>
        <button onclick="deleteProduct('${p._id}')">Eliminar</button>
      </div>
    `;
  });
}

loadProducts(),container.innerHTML += `
  <div class="card">
    <img src="${p.image}" width="100%">
    <h3>${p.title}</h3>
    <p>${p.price} MZN</p>
  </div>
`;
async function deleteProduct(id) {
  const token = localStorage.getItem("token");

  await fetch("http://localhost:5000/api/products/" + id, {
    method: "DELETE",
    headers: {
      "Authorization": token
    }
  });

  alert("Produto eliminado!");
  loadProducts();
}
if (user.email === "admin@mozsell.com") {
  user.role = "admin";
}
function isLoggedIn() {
  return localStorage.getItem("token");
}
window.onload = function() {

  if (isLoggedIn()) {
    document.getElementById("sellBtn").style.display = "inline-block";
  }

  loadProducts();
};
function goToSell() {
  window.location.href = "sell.html";
}
document.querySelector("#sellForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  const token = localStorage.getItem("token");

  await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      title: title.value,
      price: price.value,
      description: description.value
    })
  });

  alert("Produto publicado!");

  window.location.href = "index.html";
});
function showUser() {
  const token = localStorage.getItem("token");

  if (!token) return;

  fetch("http://localhost:5000/api/auth/me", {
    headers: { "Authorization": token }
  })
  .then(res => res.json())
  .then(user => {
    document.getElementById("userName").innerText = user.name;
  });
}
import { v2 as cloudinary } from 'cloudinary';

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dlzl7eixw', 
        api_key: '363611462385483', 
        api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
})();
document.querySelector("#sellForm")?.addEventListener("submit", async e => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("title", title.value);
  formData.append("price", price.value);
  formData.append("description", description.value);
  formData.append("image", image.files[0]);

  await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: {
      "Authorization": token
    },
    body: formData
  });

  alert("Produto publicado!");
});
async function loadMyProducts() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/products/my", {
    headers: { "Authorization": token }
  });

  const products = await res.json();

  const container = document.getElementById("myProducts");

  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}" width="100%">
        <h3>${p.title}</h3>
        <p>${p.price} MZN</p>
      </div>
    `;
  });
}

window.onload = loadMyProducts;