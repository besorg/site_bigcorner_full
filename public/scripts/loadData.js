window.addEventListener('DOMContentLoaded', () => {
  fetch('https://docs.google.com/spreadsheets/d/1oSXRJkVeD3napDd9bltITSA4snw4uqOgXzLtfav05yo/gviz/tq?tqx=out:csv')
    .then(res => res.text())
    .then(csvText => {
      const parsed = Papa.parse(csvText, { header: true });
      const rows = parsed.data;

      const products = rows.filter(row => row.name && row.image).map(row => ({
        name: row.name,
        description: row.description,
        image: row.image,
        price: row.price
      }));

      const whatsapp = '5491132776974';

      const reviews = rows
        .filter(row => row.reviews && row.reviews.includes('|'))
        .map(row => {
          const [quote, author] = row.reviews.split('|');
          return { quote: quote.trim(), author: author.trim() };
        });

      window.dynamicProducts = products;
      window.dynamicWhatsapp = whatsapp;

      const list = document.getElementById('burger-list');
      list.innerHTML = products.map((product, index) => `
        <div class="burger-card" onclick="openModalFromList(${index})">
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p class="price">$${product.price}</p>
        </div>
      `).join('');

      const reviewsContainer = document.getElementById('reviews-container');
      reviewsContainer.innerHTML = reviews.map(r => `
        <div class="review">
          <p>“${r.quote}”</p>
          <span>- ${r.author}</span>
        </div>
      `).join('');
    });
});
