// Test de post /sessions
describe('POST /sessions', () => {
    // Crear una función para crear un nuevo usuario
    async function createUser() {
      const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
      };
  
      return await mongoose.model('User').create(user);
    }
  
    // Crear una solicitud POST a la ruta /sessions
    async function createSession(email, password) {
      const res = await supertest(app).post('/sessions').send({ email, password });
  
      return res;
    }
  
    it('should create a new session', async () => {
      // Crear un nuevo usuario
      const user = await createUser();
  
      // Crear una sesión para el usuario
      const res = await createSession(user.email, user.password);
  
      // Verificar que el estado de respuesta sea 201
      expect(res.status).toBe(201);
  
      // Verificar que la respuesta contenga un token de autenticación
      expect(res.body.token).toBeDefined();
  
      // Verificar que el token sea válido
      expect(jsonwebtoken.verify(res.body.token, 'secret')).toBeDefined();
  
      // Verificar que la respuesta contenga la información del usuario
      expect(res.body.user.name).toBe(user.name);
      expect(res.body.user.email).toBe(user.email);
    });
  });