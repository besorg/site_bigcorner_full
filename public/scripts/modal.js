window.cart = [];

function renderCart() {
  console.log("Carrito actual:", window.cart);
  // Aquí podrías renderizar el contenido del carrito en el modal si se desea
}

function showClearCartButton() {
  const form = document.getElementById('order-form');
  if (!document.getElementById('clear-cart-button')) {
    const btn = document.createElement('button');
    btn.id = 'clear-cart-button';
    btn.type = 'button';
    btn.textContent = '¿Tu pedido fue enviado? Hacé clic acá para vaciar el carrito';
    btn.onclick = () => {
      window.cart = [];
      renderCart();
      btn.remove();
    };
    btn.style.marginTop = '1rem';
    form.appendChild(btn);
  }
}

window.openModalFromList = function(index) {
  const products = window.dynamicProducts || [];
  const product = products[index];
  if (!product) {
    console.error("Producto no encontrado en el índice:", index);
    return;
  }

  window.currentProductIndex = index;

  const modal = document.getElementById('burger-modal');
  const img = document.getElementById('modal-img');
  const title = document.getElementById('modal-title');
  const description = document.getElementById('modal-description');
  const unitPrice = document.getElementById('unit-price');
  const totalDisplay = document.getElementById('order-total');
  const productName = document.getElementById('product-name');
  const quantityInput = document.getElementById('quantity');

  img.src = product.imagen;
  img.alt = product.nombre;
  title.textContent = product.nombre;
  description.textContent = product.descripcion;
  unitPrice.textContent = `$${product.precio}`;
  totalDisplay.textContent = `$${product.precio}`;
  productName.value = product.nombre;
  quantityInput.value = 1;

  quantityInput.oninput = () => {
    const q = parseInt(quantityInput.value) || 1;
    totalDisplay.textContent = `$${q * product.precio}`;
  };

  modal.classList.remove('hidden');
};

window.closeModal = function() {
  const modal = document.getElementById('burger-modal');
  modal.classList.add('hidden');
};

window.addToCart = function() {
  const name = document.getElementById('product-name').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const product = window.dynamicProducts.find(p => p.nombre === name);
  if (!product) return;

  const existing = window.cart.find(p => p.nombre === name);
  if (existing) {
    existing.cantidad += quantity;
  } else {
    window.cart.push({ nombre: name, cantidad: quantity, precio: parseFloat(product.precio) });
  }

  renderCart();
  closeModal();
};

window.sendOrder = function() {
  const address = document.getElementById('address').value;
  const comment = document.getElementById('comment').value;

  if (window.cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let total = 0;
  let itemList = window.cart.map(item => {
    const subtotal = item.cantidad * item.precio;
    total += subtotal;
    return `- ${item.cantidad} x ${item.nombre} = $${subtotal}`;
  }).join("\n");

  const message = `¡Hola! Quisiera hacer un pedido:\n\n${itemList}\n\nTotal: $${total}\nDirección: ${address}\nComentario: ${comment}`;
  const whatsapp = "5491132776974";
  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
  showClearCartButton();
};
