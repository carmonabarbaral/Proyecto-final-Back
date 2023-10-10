const faker = require('@faker-js/faker');

// Generar los productos mockeados
const productsMockers = [];

for (let i = 0; i < 100; i++) {
  products.push({
    id: i,
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    price: Math.floor(Math.random() * 990) + 10,
  });
}

// Exportar los productos mockeados
module.exports = productsMockers;