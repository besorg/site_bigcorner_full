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

window.sendOrder = function(event) {
  event.preventDefault();

  const name = document.getElementById('product-name').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const address = document.getElementById('address').value;
  const comment = document.getElementById('comment').value;
  const price = window.dynamicProducts.find(p => p.nombre === name)?.precio || 0;

  const total = price * quantity;
  const message = `¡Hola! Quisiera pedir ${quantity} ${name}.
Dirección: ${address}
Comentario: ${comment}
Total: $${total}`;

  const whatsapp = window.dynamicWhatsapp || "5491132776974";
  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
};
