export function loadData() {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/1oSXRJkVeD3napDd9bltITSA4snw4uqOgXzLtfav05yo/gviz/tq?tqx=out:csv';

  Papa.parse(sheetUrl, {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;

      const productContainer = document.getElementById('burger-list');
      const reviewsContainer = document.getElementById('reviews-container');

      data.forEach(row => {
        if (row.nombre && row.precio) {
          // Producto
          const card = document.createElement('div');
          card.className = 'burger-card';
          card.innerHTML = `
            <img src="/images/${row.imagen}" alt="${row.nombre}" />
            <h3>${row.nombre}</h3>
            <p>${row.descripcion}</p>
            <p class="price">$${row.precio}</p>
          `;
          card.addEventListener('click', () => openModal(row));
          productContainer.appendChild(card);
        } else if (row.reseña && row.autor) {
          // Reseña
          const review = document.createElement('div');
          review.className = 'review';
          review.innerHTML = `
            <p>${row.reseña}</p>
            <span>- ${row.autor}</span>
          `;
          reviewsContainer.appendChild(review);
        }
      });
    },
    error: function(err) {
      console.error('Error al cargar los datos:', err);
    }
  });
}
