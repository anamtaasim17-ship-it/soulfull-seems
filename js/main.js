'use strict';

// ===== MODAL / TOAST / MOBILE MENU / ACCORDION =====

const notificationToast = document.querySelector('[data-toast]');

function showToast(text) {
  if (!notificationToast) { console.log(text); return; }
  const textHolder = notificationToast.querySelector('.toast-text') || notificationToast.firstElementChild;
  if (textHolder) textHolder.textContent = text;
  else notificationToast.textContent = text;
  notificationToast.classList.remove('closed');
  clearTimeout(notificationToast._hideTimeout);
  notificationToast._hideTimeout = setTimeout(() => notificationToast.classList.add('closed'), 2200);
}

const sellerNumber = "923364771816";

const products = [
  { id: 1, name: "Turkish Velvet Prayer Mat", price: 2500, img: "turkish.png", category: "mats" },
  { id: 2, name: "Couple Prayer Mat", price: 3500, img: "couple.png", category: "mats" },
  { id: 3, name: "Padded Prayer Mat", price: 2499, img: "padded prayermat.png", category: "mats" },
  { id: 4, name: "Custom Name Shawl", price: 2999, img: "cream sawl.jpg", category: "shawls" }
];

const CART_KEY = "shop_cart_v1";

// --- Cart Helpers ---
function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(i => ({ id: Number(i.id) || 0, qty: Number(i.qty) || 0 })).filter(i => i.id && i.qty);
  } catch { return []; }
}
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function getCartTotalQty(cart) {
  return (cart || readCart()).reduce((s, it) => s + (Number(it.qty) || 0), 0);
}
function updateCartCountUI() {
  const total = getCartTotalQty();
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = total);
}
function renderMiniCart() {
  const cart = readCart();
  const list = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (list) {
    list.innerHTML = '';
    cart.forEach(item => {
      const p = document.createElement('li');
      p.textContent = `Item ${item.id} × ${item.qty}`;
      list.appendChild(p);
    });
  }
  if (totalEl) totalEl.textContent = `Total: Rs ${cart.reduce((s,i)=> s + (i.qty * (i.price || 0)), 0)}`;
}

function addToCart(id, opts = {}) {
  id = Number(id);
  if (!id) return;
  const cart = readCart();
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, qty: 1, ...opts });
  saveCart(cart);
  updateCartCountUI();
  renderMiniCart();
  showToast('Added to cart');
}

// ===== UI INIT =====
document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cart-btn");
  const miniCart = document.getElementById("mini-cart");
  const checkoutBtn = document.getElementById("checkout-btn");

  // --- Search Toggle ---
  const searchToggle = document.getElementById('search-toggle');
  const navSearch = document.getElementById('nav-search');
  const searchClose = document.getElementById('search-close');
  
  searchToggle?.addEventListener('click', () => {
    if (!navSearch) return;
    navSearch.classList.add('open');
    navSearch.removeAttribute('aria-hidden');
    navSearch.removeAttribute('inert');
    navSearch.querySelector('input')?.focus();
  });

  searchClose?.addEventListener('click', () => {
    if (!navSearch) return;
    navSearch.classList.remove('open');
    navSearch.setAttribute('aria-hidden', 'true');
    navSearch.setAttribute('inert', '');
  });

  // --- Add to Cart / Buy Now Global Handler ---
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-to-cart');
    if (addBtn) {
      const id = parseInt(addBtn.dataset.id || addBtn.getAttribute('data-id'), 10);
      if (!Number.isNaN(id)) {
        addToCart(id);
        addBtn.classList.add('btn--clicked');
        setTimeout(() => addBtn.classList.remove('btn--clicked'), 200);
        miniCart?.classList.remove('hidden'); // Auto show mini-cart
      }
      return;
    }

    const buyBtn = e.target.closest('.btn-buy-now');
    if (buyBtn) {
      const id = parseInt(buyBtn.dataset.id || buyBtn.getAttribute('data-id'), 10);
      if (!Number.isNaN(id)) {
        addToCart(id);
        showToast('Proceeding to checkout...');
      }
      return;
    }
  });

  // --- Cart Toggle ---
  cartBtn?.addEventListener('click', (ev) => {
    ev.preventDefault();
    miniCart?.classList.toggle('hidden');
  });

  // --- Close search when clicking outside ---
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#nav-search') && navSearch?.classList.contains('open')) {
      navSearch.classList.remove('open');
      navSearch.setAttribute('aria-hidden', 'true');
      navSearch.setAttribute('inert', '');
    }
  });

  updateCartCountUI();
  renderMiniCart();
});


document.addEventListener("DOMContentLoaded", function () {
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  if (!placeOrderBtn) return; // safety check

  placeOrderBtn.addEventListener("click", function () {
    const product = document.getElementById("productName")?.value || "";
   const customization = document.getElementById("customDetails").value;
    const color = document.getElementById("color")?.value || "";
    const name = document.getElementById("deliveryName").value;
    const address = document.getElementById("address")?.value || "";
    const contact = document.getElementById("contact")?.value || "";

    // WhatsApp number without +
    const phoneNumber = "923364771816";

    // Encode message for WhatsApp
    const message = encodeURIComponent(
      `Hello! I want to place an order.
🛍️ Product: ${product}
✨ Customization: ${customization}
🎨 Color: ${color}
👤 Delivery Name: ${name}
🏠 Address: ${address}
📞 Contact: ${contact}`
    );

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
window.open(whatsappURL, "_blank");
  });
});
