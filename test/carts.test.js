// Test de get /carts/:id
describe('GET /carts/:id', () => {
    it('should return a cart with its products', async () => {
      const cart = await createCart();
  
      const res = await supertest(app).get(`/carts/${cart.id}`);
  
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.products).toBeInstanceOf(Array);
      expect(res.body.products.length).toBeGreaterThan(0);
    });
  });
  
  // Test de post /carts/:id/products
  describe('POST /carts/:id/products', () => {
    it('should add a product to a cart', async () => {
      const cart = await createCart();
      const product = await createProduct();
  
      const res = await supertest(app).post(`/carts/${cart.id}/products`).send({ productId: product.id });
  
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.products).toBeInstanceOf(Array);
      expect(res.body.products.length).toBe(1);
    });
  });
  
  // Test de delete /carts/:id/products/:productId
  describe('DELETE /carts/:id/products/:productId', () => {
    it('should remove a product from a cart', async () => {
      const cart = await createCart();
      const product = await createProduct();
  
      await supertest(app).post(`/carts/${cart.id}/products`).send({ productId: product.id });
  
      const res = await supertest(app).delete(`/carts/${cart.id}/products/${product.id}`);
  
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.products).toBeInstanceOf(Array);
      expect(res.body.products.length).toBe(0);
    });
  });