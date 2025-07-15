// ...código anterior...

let cart = [];
let currentIndex = 0;

let startX = null;
let endX = null;

function setupSwipeListeners() {
  const modal = document.getElementById('burger-modal');
  if (!modal) return;

  // Swipe en pantallas táctiles
  modal.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  modal.addEventListener('touchend', e => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  // Swipe con mouse
  modal.addEventListener('mousedown', e => {
    startX = e.clientX;
  });

  modal.addEventListener('mouseup', e => {
    endX = e.clientX;
    handleSwipe();
  });
}

function handleSwipe() {
  if (startX === null || endX === null) return;
  const deltaX = endX - startX;
  if (Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      prevProduct();
    } else {
      nextProduct();
    }
  }
  startX = null;
  endX = null;
}

function addToCart() {
  const name = document.getElementById('product-name').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const price = parseFloat(document.getElementById('unit-price').textContent.replace('$', ''));
  if (!name || quantity <= 0) return;

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name, quantity, price });
  }
  renderCart();
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-summary');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p style="margin-top: 1rem;">Tu carrito está vacío.</p>';
    return;
  }

  let total = 0;
  const itemsHTML = cart.map(item => {
    const subtotal = item.quantity * item.price;
    total += subtotal;
    return `
      <div class="cart-item">
        <span><strong>${item.quantity}×</strong> ${item.name}</span>
        <span>$${subtotal}</span>
        <button class="remove-btn" onclick="removeFromCart('${item.name}')">❌</button>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="cart-list">${itemsHTML}</div>
    <p class="cart-total"><strong>Total: $${total}</strong></p>
  `;
}

function clearCart() {
  cart = [];
  renderCart();
}

function getCartText() {
  if (cart.length === 0) return '';
  let text = 'Pedido:\n';
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.quantity * item.price;
    total += subtotal;
    text += `- ${item.quantity}× ${item.name}: $${subtotal}\n`;
  });
  text += `\nTotal: $${total}`;
  return text;
}

function sendOrder(event) {
  event.preventDefault();

  const address = document.getElementById('address').value;
  const comment = document.getElementById('comment').value;

  const text = getCartText() + `\n\nDirección: ${address}\nComentario: ${comment}`;
  if (!text.trim()) return;

  const url = `https://wa.me/5491132776974?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');

  const container = document.getElementById('cart-summary');
  const clearBtn = document.createElement('button');
  clearBtn.textContent = '¿Tu pedido fue enviado? Hacé clic acá para vaciar el carrito';
  clearBtn.onclick = () => {
    clearCart();
    clearBtn.remove();
  };
  clearBtn.classList.add('btn-clear');
  container.appendChild(clearBtn);
}

function openModalFromList(index) {
  const product = window.dynamicProducts[index];
  if (!product) return;

  currentIndex = index;

  document.getElementById('modal-img').src = product.imagen;
  document.getElementById('modal-title').textContent = product.nombre;
  document.getElementById('modal-description').textContent = product.descripcion;
  document.getElementById('unit-price').textContent = `$${product.precio}`;
  document.getElementById('order-total').textContent = `$${product.precio}`;
  document.getElementById('product-name').value = product.nombre;
  document.getElementById('quantity').value = 1;

  document.getElementById('burger-modal').classList.remove('hidden');
  renderCart();
  setupSwipeListeners();
}

function nextProduct() {
  if (!window.dynamicProducts) return;
  currentIndex = (currentIndex + 1) % window.dynamicProducts.length;
  openModalFromList(currentIndex);
}

function prevProduct() {
  if (!window.dynamicProducts) return;
  currentIndex = (currentIndex - 1 + window.dynamicProducts.length) % window.dynamicProducts.length;
  openModalFromList(currentIndex);
}

function closeModal() {
  document.getElementById('burger-modal').classList.add('hidden');
}
