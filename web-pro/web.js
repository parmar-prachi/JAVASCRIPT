//  CONSTANTS & DEFAULT PRODUCTS

const INVENTORY_KEY = "productInventory";
const CART_KEY = "shoppingCart";

const defaultProducts = [
  {
    id: 101, name: "Scalp Moisturizing Cream", description: "🧴 Primary Purpos The main goal of a scalp moisturizing cream is to replenish lost moisture and help maintain the scalp's natural barrier. This is essential because a healthy scalp is the foundation for healthy hair growth. ✨ Key Benefit Relieves Dryness and Itchiness: It provides immediate soothing relief to a dry, irritated, or itchy scalp. Reduces Flakiness / Dandruff: By moisturizing the skin, it can help prevent the dead skin cells from flaking off, often associated with dry scalp(though medicated ingredients are often needed for true dandruff, or seborrheic dermatitis). Soothes Scalp: Many formulas contain anti - inflammatory or soothing ingredients like aloe vera, tea tree oil, or specialized compounds to calm irritation. Supports Protective Styles: It's especially popular for use with braids, twists, or locs, as it can be applied directly to the scalp without disturbing the hairstyle to keep the skin nourished.",priceUSD: 29, image: "./assets/images/products/product-1.jpg", qty: 10 },
  {
    id: 102, name: "Enriched Hand & Body Wash", description: "💧 Common Enriching IngredieThe enriched nature comes from the inclusion of deeply hydrating and soothing components:Humectants(Moisture - Drawers): Glycerin or Hyaluronic Acid to pull moisture into the top layers of the skin.Emollients(Softening Agents): Natural Oils(like Argan, Coconut, Jojoba, or Grapeseed Oil) or Butters(like Shea Butter) to smooth and soften the skin's surfacAntioxidants / Vitamins: Ingredients like Vitamin E or White Tea Extract to help protect the skin from environmental stressorSoothing Extracts: Aloe Vera or Chamomile to calm irritation and redness.",priceUSD: 23, image: "./assets/images/products/product-2.jpg", qty: 10 },
  { id: 103, name: "Enriched Hand Wash", description:" An Enriched Hand Wash is a liquid cleansing product specifically formulated to prioritize the skin's health and moisture balance, especially with the frequency of modern handwashing. It goes beyond the basic function of removing dirt and germs by actively nourishing and conditioning the skin." ,priceUSD: 25, image: "./assets/images/products/product-3.jpg", qty: 10 },
  {
    id: 104, name: "Enriched Duo", description: " The term Enriched Duo refers to a set of two complementary products, most commonly found in the realm of skincare, hand care, or hair care, that are specially formulated with a high concentration of nourishing or therapeutic ingredients.The Duo indicates the pairing of two items, and Enriched highlights that these products contain premium, skin- benefiting components(like vitamins, oils, or botanical extracts) that go beyond standard formulations." ,priceUSD: 27, image: "./assets/images/products/product-4.jpg", qty: 10 }
];

//  SIMPLE STORAGE HELPERS

const getStore = key => JSON.parse(localStorage.getItem(key)) || [];
const setStore = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const loadInventory = () => getStore(INVENTORY_KEY);
const saveInventory = data => setStore(INVENTORY_KEY, data);

const loadCart = () => getStore(CART_KEY);
const saveCart = data => setStore(CART_KEY, data);

//  INITIAL DEFAULT PRODUCTS

if (!localStorage.getItem(INVENTORY_KEY)) saveInventory(defaultProducts);

//  ADD NEW PRODUCT

window.addProduct = product => {
  const items = loadInventory();
  items.push(product);
  saveInventory(items);
};

//  ADD TO CART

window.addToCart = (id, qty = 1) => {
  const inventory = loadInventory();
  const cart = loadCart();

  const product = inventory.find(p => p.id === id);
  if (!product) return alert("Product not found!");

  const existing = cart.find(p => p.id === id);

  existing ? existing.cartQty += qty : cart.push({ ...product, cartQty: qty });

  saveCart(cart);
  alert(`${qty} item(s) added to cart!`);

  if (document.getElementById("cart-table-container")) renderCart();
};

//  USD → INR

const usdToInr = usd => (usd * 89).toFixed(2);

// PRODUCT CARD GENERATOR

const productImg = img =>
  img.startsWith("blob:") || img.startsWith("./") ? img : "./assets/images/products/placeholder.jpg";

const generateProductCardHtml = p => `
  <div class="col-12 col-md-6 col-lg-3 d-flex justify-content-center">
    <div class="product-card text-center">
      <div class="product-image-container">
        ${!defaultProducts.some(d => d.id === p.id) ? '<span class="product-label label-new">New</span>' : ""}
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


//RENDER HOME PAGE PRODUCTS

const renderIndexProducts = () => {
  const box = document.getElementById("index-product-list");
  if (!box) return;

  const inventory = loadInventory();
  const defaultIds = defaultProducts.map(p => p.id);

  box.innerHTML = inventory
    .filter(p => !defaultIds.includes(p.id))
    .map(generateProductCardHtml)
    .join("");
};

//  DETAILS PAGE

const getParam = key => new URLSearchParams(location.search).get(key);

const renderProductDetails = () => {
  const box = document.getElementById("product-details-container");
  if (!box) return;

  const id = Number(getParam("id"));
  const product = loadInventory().find(p => p.id === id);

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
      <p>${product.description || "A quality product from GLOWING collection."}</p>

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
};

// VIEW-PRODUCT TABLE

const renderInventory = () => {
  const box = document.getElementById("product-table-container");
  if (!box) return;

  const items = loadInventory();
  if (!items.length) {
    box.innerHTML = `<p class="text-center text-muted">No products found.</p>`;
    return;
  }

  box.innerHTML = `
    <table class="table table-bordered text-center">
      <thead>
        <tr><th>ID</th><th>Image</th><th>Name</th><th>Qty</th><th>Price (INR)</th><th>Action</th></tr>
      </thead>
      <tbody>
        ${items.map(p => `
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
        `).join("")}
      </tbody>
    </table>
     <button onclick="clearInventory()" class="btn btn-danger">Clear List</button>
  `;
};

// DELETE PRODUCT

window.deleteProduct = id => {
  saveInventory(loadInventory().filter(p => p.id !== id));
  alert("Product deleted.");
  location.reload();
};

// CLEAR INVENTORY 🗑️
window.clearInventory = () => {
  const currentInventory = loadInventory();

  const defaultIds = defaultProducts.map(p => p.id);

  const updatedInventory = currentInventory.filter(p => defaultIds.includes(p.id));

  saveInventory(updatedInventory);

  renderInventory();
};

//  RENDER CART 

const renderCart = () => {
  const box = document.getElementById("cart-table-container");
  if (!box) return;

  const cart = loadCart();
  if (!cart.length) {
    box.innerHTML = `<p class="text-center text-muted">Your cart is empty.</p>`;
    return;
  }

  let total = 0;

  box.innerHTML = `

   <div class="cart-page-btn text-end mb-3">
                    <a href="index.html" class="text-dark text-decoration-none">← Back to Add Product</a>
                </div>
    <table class="table table-bordered text-center">
      <thead>
        <tr><th>Image</th><th>Name</th><th>Qty</th><th>Unit</th><th>Total</th><th>Action</th></tr>
      </thead>
      <tbody>
        ${cart.map(i => {
    const price = usdToInr(i.priceUSD);
    const rowTotal = (price * i.cartQty).toFixed(2);
    total += Number(rowTotal);

    return `
            <tr>
              <td><img src="${i.image}" width="60"></td>
              <td>${i.name}</td>
              <td>
                <button onclick="decreaseQty(${i.id})" class="btn btn-sm btn-secondary">-</button>
                <span class="mx-2">${i.cartQty}</span>
                <button onclick="increaseQty(${i.id})" class="btn btn-sm btn-secondary">+</button>
              </td>
              <td>₹${price}</td>
              <td>₹${rowTotal}</td>
              <td><button onclick="removeItem(${i.id})" class="btn btn-danger btn-sm"><i class="bi bi-trash3"></button></td>
            </tr>
          `;
  }).join("")}
      </tbody>
    </table>
    <div class="d-flex justify-content-between align-items-center mt-3">
      <button onclick="clearCart()" class="btn btn-danger">Clear Cart</button>
      <h3 class="mb-0">Grand Total: <strong>₹${total.toFixed(2)}</strong></h3>
    </div>
  `;
};

// CART CONTROLS

window.increaseQty = id => {
  const cart = loadCart();
  cart.find(p => p.id === id).cartQty++;
  saveCart(cart);
  renderCart();
};

window.decreaseQty = id => {
  let cart = loadCart();
  const item = cart.find(p => p.id === id);

  item.cartQty > 1
    ? item.cartQty--
    : cart = cart.filter(p => p.id !== id);

  saveCart(cart);
  renderCart();
};

window.removeItem = id => {
  saveCart(loadCart().filter(p => p.id !== id));
  renderCart();
};

// CLEAR CART 🗑️
window.clearCart = () => {
  // Clears the cart data from local storage
  saveCart([]);

  // Re-renders the cart table, which will now show "Your cart is empty."
  renderCart();

};


// PAGE LOAD EVENTS

document.addEventListener("DOMContentLoaded", () => {
  renderInventory();
  renderCart();
  renderIndexProducts();
  renderProductDetails();

  /* Add Product Form */

  const form = document.getElementById("addProductForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const img = productImage.files[0]
        ? URL.createObjectURL(productImage.files[0])
        : "./assets/images/products/placeholder.jpg";

      addProduct({
        id: +productId.value,
        name: productName.value,
        priceUSD: +productPrice.value,
        qty: +productQty.value,
        image: img,
        description: productDesc.value
      });

      alert("Product added!");
      form.reset();
    });
  }

  /* Details Page Qty Control */

  const qtyDisplay = document.getElementById("qty-display");
  const minus = document.getElementById("qty-minus");
  const plus = document.getElementById("qty-plus");
  const addBtn = document.getElementById("add-to-cart-button");
  const box = document.getElementById("product-details-container");

  if (qtyDisplay && minus && plus) {
    plus.onclick = () => qtyDisplay.textContent = +qtyDisplay.textContent + 1;
    minus.onclick = () => qtyDisplay.textContent > 1 &&
      (qtyDisplay.textContent = +qtyDisplay.textContent - 1);
  }

  if (addBtn && box) {
    const id = +box.getAttribute("data-product-id");
    addBtn.onclick = () => addToCart(id, +qtyDisplay.textContent);
  }
});
