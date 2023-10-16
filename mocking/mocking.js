const faker = require('@faker-js/faker');

// Generar los productos mockeados
const productsMockers = [];

for (let i = 0; i < 100; i++) {
  // Generar un producto mockeado
  const product = faker.commerce.product();

  // Agregar el producto mockeado a la lista de productos mockeados
  productsMockers.push({
    id: product.id,
    name: product.name,
    description: faker.lorem.paragraph(),
    price: Math.floor(Math.random() * 990) + 10,
  });
}

// Exportar los productos mockeados
module.exports = productsMockers;