const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest('http://localhost:1010');

//test de get/ products//
describe('GET /products', () => {
  it('should return a list of products', async () => {
    const res = await supertest(app).get('/products');

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

// Test de post /products
describe('POST /products', () => {
  it('should create a new product', async () => {
    const newProduct = {
      name: 'Test product',
      price: 100,
      description: 'This is a test product.',
    };

    const res = await supertest(app).post('/products').send(newProduct);

    expect(res.status).toBe(201);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.price).toBe(newProduct.price);
    expect(res.body.description).toBe(newProduct.description);
  });
});

// Test de put /products/:id
describe('PUT /products/:id', () => {
  it('should update an existing product', async () => {
    const product = await createProduct();

    const updatedProduct = {
      name: 'Updated test product',
      price: 200,
      description: 'This is an updated test product.',
    };

    const res = await supertest(app).put(`/products/${product.id}`).send(updatedProduct);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.name).toBe(updatedProduct.name);
    expect(res.body.price).toBe(updatedProduct.price);
    expect(res.body.description).toBe(updatedProduct.description);
  });
});