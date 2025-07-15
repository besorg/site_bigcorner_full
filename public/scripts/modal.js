window.openModalFromList = function(index) {
  const products = window.dynamicProducts || [];
  const whatsapp = window.dynamicWhatsapp || "5491132776974";

  const product = products[index];
  if (!product) {
    console.error("Producto no encontrado en el índice:", index);
    return;
  }

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

  // actualizar total al cambiar cantidad
  quantityInput.oninput = () => {
    const q = parseInt(quantityInput.value) || 1;
    totalDisplay.textContent = `$${q * product.price}`;
  };

  modal.classList.remove('hidden');
};

window.closeModal = function() {
  const modal = document.getElementById('burger-modal');
  modal.classList.add('hidden');
};

window.sendOrder = function(event) {
  event.preventDefault();

  const name = document.getElementById('product-name').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const address = document.getElementById('address').value;
  const comment = document.getElementById('comment').value;
  const price = window.dynamicProducts.find(p => p.name === name)?.price || 0;

  const total = price * quantity;
  const message = `¡Hola! Quisiera pedir ${quantity} ${name}.\nDirección: ${address}\nComentario: ${comment}\nTotal: $${total}`;

  const whatsapp = window.dynamicWhatsapp || "5491132776974";
  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
};
