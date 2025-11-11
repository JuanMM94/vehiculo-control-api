import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../src/index.js';

describe('Integration Tests - Autenticación', () => {
  let testUser = {
    nombre: 'Test Usuario',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    rol: 'Operador',
  };

  describe('POST /api/usuarios/register', () => {
    it('debe registrar un nuevo usuario exitosamente', async () => {
      const response = await request(app)
        .post('/api/usuarios/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.usuario.email).toBe(testUser.email);
      expect(response.body.usuario.nombre).toBe(testUser.nombre);
      expect(response.body.usuario).not.toHaveProperty('password');
    });

    it('debe rechazar registro con email duplicado', async () => {
      await request(app)
        .post('/api/usuarios/register')
        .send(testUser);

      const response = await request(app)
        .post('/api/usuarios/register')
        .send(testUser);

      expect(response.status).toBe(400);
    });

    it('debe rechazar registro sin campos requeridos', async () => {
      const response = await request(app)
        .post('/api/usuarios/register')
        .send({ email: 'incomplete@test.com' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/usuarios/login', () => {
    it('debe iniciar sesión con credenciales válidas', async () => {
      const newUser = {
        nombre: 'Login Test',
        email: `login${Date.now()}@example.com`,
        password: 'password123',
        rol: 'Administrador',
      };

      await request(app)
        .post('/api/usuarios/register')
        .send(newUser);

      const response = await request(app)
        .post('/api/usuarios/login')
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.usuario.email).toBe(newUser.email);
    });

    it('debe rechazar credenciales inválidas', async () => {
      const response = await request(app)
        .post('/api/usuarios/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });

    it('debe rechazar usuario inexistente', async () => {
      const response = await request(app)
        .post('/api/usuarios/login')
        .send({
          email: 'noexiste@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
    });
  });
});
