// scripts/modal.js

let currentIndex = 0;
let cart = [];

function updateModal(product) {
  const modal = document.getElementById('burger-modal');
  const img = document.getElementById('modal-img');
  const title = document.getElementById('modal-title');
  const description = document.getElementById('modal-description');
  const unitPrice = document.getElementById('unit-price');
  const totalDisplay = document.getElementById('order-total');
  const productName = document.getElementById('product-name');
  const quantityInput = document.getElementById('quantity');

  img.src = product.image;
  img.alt = product.name;
  title.textContent = product.name;
  description.textContent = product.description;
  unitPrice.textContent = `$${product.price}`;
  totalDisplay.textContent = `$${product.price}`;
  productName.value = product.name;
  quantityInput.value = 1;

  quantityInput.oninput = () => {
    const q = parseInt(quantityInput.value) || 1;
    totalDisplay.textContent = `$${q * product.price}`;
  };

  updateNavButtons();
  updateCartButton(product);

  modal.classList.remove('hidden');
}

function updateNavButtons() {
  document.getElementById('prev-btn').disabled = currentIndex <= 0;
  document.getElementById('next-btn').disabled = currentIndex >= window.dynamicProducts.length - 1;
}

function updateCartButton(product) {
  const cartBtn = document.getElementById('toggle-cart-btn');
  const isInCart = cart.some(p => p.name === product.name);
  cartBtn.textContent = isInCart ? 'Quitar del carrito' : 'Agregar al carrito';
  cartBtn.onclick = () => {
    const index = cart.findIndex(p => p.name === product.name);
    if (index >= 0) {
      cart.splice(index, 1);
    } else {
      cart.push({ ...product, quantity: parseInt(document.getElementById('quantity').value) || 1 });
    }
    updateCartButton(product);
    renderCartSummary();
  };
}

function renderCartSummary() {
  const container = document.getElementById('cart-summary');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<p>No hay productos en el carrito.</p>';
    return;
  }

  const itemsHTML = cart.map(item => `<li>${item.quantity} x ${item.name} = $${item.quantity * item.price}</li>`).join('');
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  container.innerHTML = `
    <ul>${itemsHTML}</ul>
    <p><strong>Total:</strong> $${total}</p>
    <a class="btn" href="https://wa.me/${window.dynamicWhatsapp}?text=${encodeURIComponent(generateWhatsAppMessage())}" target="_blank">Finalizar pedido por WhatsApp</a>
  `;
}

function generateWhatsAppMessage() {
  const lines = cart.map(item => `${item.quantity} x ${item.name} = $${item.quantity * item.price}`);
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  return `Hola! Quisiera hacer un pedido:\n${lines.join('\n')}\nTotal: $${total}`;
}

window.openModalFromList = function(index) {
  currentIndex = index;
  const product = window.dynamicProducts[index];
  updateModal(product);
};

window.closeModal = function() {
  document.getElementById('burger-modal').classList.add('hidden');
};

window.sendOrder = function(e) {
  e.preventDefault();
  const name = document.getElementById('product-name').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const address = document.getElementById('address').value;
  const comment = document.getElementById('comment').value;
  const product = window.dynamicProducts.find(p => p.name === name);
  const price = product?.price || 0;
  const total = price * quantity;

  const message = `¡Hola! Quisiera pedir ${quantity} ${name}.\nDirección: ${address}\nComentario: ${comment}\nTotal: $${total}`;
  window.open(`https://wa.me/${window.dynamicWhatsapp}?text=${encodeURIComponent(message)}`, '_blank');
};

window.nextProduct = function() {
  if (currentIndex < window.dynamicProducts.length - 1) {
    currentIndex++;
    updateModal(window.dynamicProducts[currentIndex]);
  }
};

window.prevProduct = function() {
  if (currentIndex > 0) {
    currentIndex--;
    updateModal(window.dynamicProducts[currentIndex]);
  }
};
