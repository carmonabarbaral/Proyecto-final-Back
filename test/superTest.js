const chai = require ('chai')
const supertest = require ('supertest')
const expect = chai.expect
const requester = supertest('localhost:1010')

describe('Productos', () => {
    it('debe crear un producto correctamente', async () => {
      const product = {
        name: 'Producto 1',
        price: 100,
      };
  
      const response = await requester.post('/api/products').send(product);
  
      expect(response.statusCode).to.be.equal(200);
      expect(response.body.status).to.be.equal('success');
      expect(response.body.payload).to.have.property('_id');
      expect(response.body.payload.name).to.equal(product.name);
      expect(response.body.payload.price).to.equal(product.price);
    });
  });