//  SIMPLE CONSTANTS

const INVENTORY_KEY = "productInventory";
const CART_KEY = "shoppingCart";

// Default products 

const defaultProducts = [
  { id: 101, name: "Scalp Moisturizing Cream", priceUSD: 29, image: "./assets/images/products/product-1.jpg", qty: 10, description: "..." },
  { id: 102, name: "Enriched Hand & Body Wash", priceUSD: 23, image: "./assets/images/products/product-2.jpg", qty: 10, description: "..." },
  { id: 103, name: "Enriched Hand Wash", priceUSD: 25, image: "./assets/images/products/product-3.jpg", qty: 10, description: "..." },
  { id: 104, name: "Enriched Duo", priceUSD: 27, image: "./assets/images/products/product-4.jpg", qty: 10, description: "..." }
];

//  SIMPLE LOCAL STORAGE FUNCTIONS

// get stored data

function getStore(key) {
  let data = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  return [];
}

// set data

function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadInventory() {
  return getStore(INVENTORY_KEY);
}

function saveInventory(data) {
  setStore(INVENTORY_KEY, data);
}

function loadCart() {
  return getStore(CART_KEY);
}

function saveCart(data) {
  setStore(CART_KEY, data);
}

//  INITIALIZE DEFAULT PRODUCTS

if (!localStorage.getItem(INVENTORY_KEY)) {
  saveInventory(defaultProducts);
}
//  ADD PRODUCT~

function addProduct(product) {
  let items = loadInventory();
  items.push(product);
  saveInventory(items);
}

//  ADD TO CART

function addToCart(id, qty = 1) {
  let inventory = loadInventory();
  let cart = loadCart();

  // find product

  let product = null;
  for (let p of inventory) {
    if (p.id === id) product = p;
  }

  if (!product) {
    alert("Product not found!");
    return;
  }

  // check existing in cart

  let exists = false;
  for (let i of cart) {
    if (i.id === id) {
      i.cartQty += qty;
      exists = true;
    }
  }

  // if not already added

  if (!exists) {
    let newItem = {
      id: product.id,
      name: product.name,
      priceUSD: product.priceUSD,
      qty: product.qty,
      image: product.image,
      description: product.description,
      cartQty: qty
    };
    cart.push(newItem);
  }

  saveCart(cart);
  alert(qty + " item(s) added to cart!");

  if (document.getElementById("cart-table-container")) {
    renderCart();
  }
}

//  USD → INR

function usdToInr(usd) {
  return (usd * 89).toFixed(2);
}

// fallback image

function productImg(img) {
  if (img) return img;
  return "./assets/images/products/placeholder.jpg";
}

//  PRODUCT CARD (HOME PAGE)

function generateProductCardHtml(p) {
  let isNew =
    defaultProducts.findIndex(function (d) { return d.id === p.id; }) === -1;

  let label = isNew ? '<span class="product-label label-new">New</span>' : "";

  return `
    <div class="col-12 col-md-6 col-lg-3 d-flex justify-content-center">
      <div class="product-card text-center">
        <div class="product-image-container">
          ${label}
          <img src="${productImg(p.image)}" class="img-fluid">
        </div>
        <div class="product-info">
          <p class="current-price">$${p.priceUSD.toFixed(2)}</p>
          <p class="product-name">${p.name}</p>
        </div>
        <div class="pro-btn">
          <button class="card-btn" onclick="addToCart(${p.id})">Add Cart</button>
          <a href="./view-details.html?id=${p.id}" class="card-btn text-dark text-decoration-none p-2">View Details</a>
        </div>
      </div>
    </div>
  `;
}

//  RENDER INDEX PRODUCTS

function renderIndexProducts() {
  let box = document.getElementById("index-product-list");
  if (!box) return;

  let inventory = loadInventory();
  let defaultIds = defaultProducts.map(function (p) { return p.id; });

  let html = "";

  for (let p of inventory) {
    if (defaultIds.indexOf(p.id) === -1) {
      html += generateProductCardHtml(p);
    }
  }

  box.innerHTML = html;
}

//  DETAILS PAGE

function getParam(key) {
  let params = new URLSearchParams(location.search);
  return params.get(key);
}

function renderProductDetails() {
  let box = document.getElementById("product-details-container");
  if (!box) return;

  let id = Number(getParam("id"));
  let inventory = loadInventory();
  let product = null;

  for (let p of inventory) {
    if (p.id === id) product = p;
  }

  if (!product) {
    box.innerHTML = `<p class="text-danger text-center">Product not found.</p>`;
    return;
  }

  box.setAttribute("data-product-id", product.id);

  box.innerHTML = `
    <div class="col-md-6">
      <img src="${productImg(product.image)}" class="img-fluid border rounded shadow-sm">
    </div>
    <div class="col-md-6 pt-4 pt-md-0">
      <h2>${product.name}</h2>
      <p class="fs-4 text-success">$${product.priceUSD.toFixed(2)}</p>
      <p><strong>Stock:</strong> ${product.qty}</p>
      <p>${product.description}</p>

      <div class="d-flex align-items-center mt-4">
        <div class="input-group" style="width:150px;">
          <button id="qty-minus" class="btn btn-outline-secondary">-</button>
          <span id="qty-display" class="form-control text-center">1</span>
          <button id="qty-plus" class="btn btn-outline-secondary">+</button>
        </div>
        <button id="add-to-cart-button" class="btn btn-dark ms-3">
          <i class="bi bi-cart me-2"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

//  VIEW PRODUCT TABLE

function renderInventory() {
  let box = document.getElementById("product-table-container");
  if (!box) return;

  let items = loadInventory();

  if (items.length === 0) {
    box.innerHTML = `<p class="text-center text-muted">No products found.</p>`;
    return;
  }

  let html = `
    <table class="table table-bordered text-center">
      <thead>
        <tr><th>ID</th><th>Image</th><th>Name</th><th>Qty</th><th>Price (INR)</th><th>Action</th></tr>
      </thead>
      <tbody>
  `;

  for (let p of items) {
    html += `
      <tr>
        <td>${p.id}</td>
        <td><img src="${productImg(p.image)}" width="60"></td>
        <td>${p.name}</td>
        <td>${p.qty}</td>
        <td>₹${usdToInr(p.priceUSD)}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})"><i class="bi bi-cart"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})"><i class="bi bi-trash3"></i></button>
        </td>
      </tr>
    `;
  }

  html += `
      </tbody>
    </table>
    <button onclick="clearInventory()" class="btn btn-danger">Clear List</button>
  `;

  box.innerHTML = html;
}

//  DELETE PRODUCT

function deleteProduct(id) {
  let items = loadInventory();

  let newList = items.filter(function (p) {
    return p.id !== id;
  });

  saveInventory(newList);
  alert("Product deleted.");
  location.reload();
}


//  CLEAR INVENTORY

function clearInventory() {
  let items = loadInventory();
  let defaultIds = defaultProducts.map(function (p) { return p.id; });

  let onlyDefaults = items.filter(function (p) {
    return defaultIds.indexOf(p.id) !== -1;
  });

  saveInventory(onlyDefaults);
  renderInventory();
}

//  RENDER CART

function renderCart() {
  let box = document.getElementById("cart-table-container");
  if (!box) return;

  let cart = loadCart();

  if (cart.length === 0) {
    box.innerHTML = `<p class="text-center text-muted">Your cart is empty.</p>`;
    return;
  }

  let html = `
    <div class="cart-page-btn text-end mb-3">
      <a href="index.html" class="text-dark text-decoration-none">← Back to Add Product</a>
    </div>
    <table class="table table-bordered text-center">
      <thead>
        <tr><th>Image</th><th>Name</th><th>Qty</th><th>Unit</th><th>Total</th><th>Action</th></tr>
      </thead>
      <tbody>
  `;

  let grandTotal = 0;

  for (let item of cart) {
    let unitPrice = usdToInr(item.priceUSD);
    let rowTotal = (unitPrice * item.cartQty).toFixed(2);
    grandTotal += Number(rowTotal);

    html += `
      <tr>
        <td><img src="${item.image}" width="60"></td>
        <td>${item.name}</td>
        <td>
          <button onclick="decreaseQty(${item.id})" class="btn btn-sm btn-secondary">-</button>
          <span class="mx-2">${item.cartQty}</span>
          <button onclick="increaseQty(${item.id})" class="btn btn-sm btn-secondary">+</button>
        </td>
        <td>₹${unitPrice}</td>
        <td>₹${rowTotal}</td>
        <td><button onclick="removeItem(${item.id})" class="btn btn-danger btn-sm"><i class="bi bi-trash3"></i></button></td>
      </tr>
    `;
  }

  html += `
      </tbody>
    </table>

    <div class="d-flex justify-content-between align-items-center mt-3">
      <button onclick="clearCart()" class="btn btn-danger">Clear Cart</button>
      <h3 class="mb-0">Grand Total: <strong>₹${grandTotal.toFixed(2)}</strong></h3>
    </div>
  `;

  box.innerHTML = html;
}

//  CART CONTROLS

function increaseQty(id) {
  let cart = loadCart();

  for (let i of cart) {
    if (i.id === id) {
      i.cartQty++;
    }
  }

  saveCart(cart);
  renderCart();
}

function decreaseQty(id) {
  let cart = loadCart();
  let newCart = [];

  for (let i of cart) {
    if (i.id === id) {
      if (i.cartQty > 1) {
        i.cartQty--;
        newCart.push(i);
      }
    } else {
      newCart.push(i);
    }
  }

  saveCart(newCart);
  renderCart();
}

function removeItem(id) {
  let cart = loadCart();
  let newCart = cart.filter(function (p) {
    return p.id !== id;
  });

  saveCart(newCart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

//  PAGE LOAD EVENTS

document.addEventListener("DOMContentLoaded", function () {
  renderInventory();
  renderCart();
  renderIndexProducts();
  renderProductDetails();

  // ADD PRODUCT FORM

  let form = document.getElementById("addProductForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let file = productImage.files[0];

      if (file) {
        let reader = new FileReader();
        reader.onload = function () {
          addProduct({
            id: Number(productId.value),
            name: productName.value,
            priceUSD: Number(productPrice.value),
            qty: Number(productQty.value),
            image: reader.result,
            description: productDesc.value
          });

          alert("Product added!");
          form.reset();
        };
        reader.readAsDataURL(file);
      } else {
        addProduct({
          id: Number(productId.value),
          name: productName.value,
          priceUSD: Number(productPrice.value),
          qty: Number(productQty.value),
          image: "./assets/images/products/placeholder.jpg",
          description: productDesc.value
        });

        alert("Product added!");
        form.reset();
      }
    });
  }

  // DETAILS PAGE QUANTITY FUNCTION
  
  let qtyDisplay = document.getElementById("qty-display");
  let minus = document.getElementById("qty-minus");
  let plus = document.getElementById("qty-plus");
  let addBtn = document.getElementById("add-to-cart-button");
  let box = document.getElementById("product-details-container");

  if (qtyDisplay && plus && minus) {
    plus.onclick = function () {
      qtyDisplay.textContent = Number(qtyDisplay.textContent) + 1;
    };

    minus.onclick = function () {
      if (Number(qtyDisplay.textContent) > 1) {
        qtyDisplay.textContent = Number(qtyDisplay.textContent) - 1;
      }
    };
  }

  if (addBtn && box) {
    let id = Number(box.getAttribute("data-product-id"));
    addBtn.onclick = function () {
      addToCart(id, Number(qtyDisplay.textContent));
    };
  }
});
