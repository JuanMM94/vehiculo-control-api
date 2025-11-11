import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize, { testConnection, syncDatabase } from './config/database.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middlewares globales
 */
app.use(helmet()); // Seguridad HTTP headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
})); // CORS
app.use(morgan('dev')); // Logging de requests
app.use(express.json()); // Parser de JSON
app.use(express.urlencoded({ extended: true })); // Parser de URL encoded

/**
 * Rutas
 */
app.use('/api', routes);

/**
 * Manejo de errores
 */
app.use(notFound); // 404
app.use(errorHandler); // Error handler global

/**
 * Inicialización del servidor
 */
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    console.log('Verificando conexión a la base de datos...');
    const connected = await testConnection();

    if (!connected) {
      console.error('No se pudo conectar a la base de datos. Abortando inicio del servidor.');
      process.exit(1);
    }

    // Sincronizar modelos con la base de datos
    console.log('Sincronizando modelos con la base de datos...');
    await syncDatabase({
      alter: process.env.NODE_ENV === 'development', // Solo en desarrollo
      // force: false, // NUNCA usar force: true en producción (elimina todas las tablas)
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('');
      console.log('╔════════════════════════════════════════════════════════╗');
      console.log('║   API de Control de Vehículos - Sistema de Gestión    ║');
      console.log('╠════════════════════════════════════════════════════════╣');
      console.log(`║   Servidor ejecutándose en puerto: ${PORT}               ║`);
      console.log(`║   Entorno: ${process.env.NODE_ENV || 'development'}                      ║`);
      console.log(`║   Base de datos: ${process.env.DB_NAME}              ║`);
      console.log('╠════════════════════════════════════════════════════════╣');
      console.log(`║   URL Base: http://localhost:${PORT}/api                ║`);
      console.log('╚════════════════════════════════════════════════════════╝');
      console.log('');
      console.log('Endpoints disponibles:');
      console.log(`  - POST   /api/usuarios/register      (Registrar usuario)`);
      console.log(`  - POST   /api/usuarios/login         (Iniciar sesión)`);
      console.log(`  - GET    /api/vehiculos              (Listar vehículos)`);
      console.log(`  - POST   /api/vehiculos              (Crear vehículo)`);
      console.log(`  - PATCH  /api/vehiculos/:id/estado   (Cambiar estado)`);
      console.log(`  - GET    /api/mantenimientos         (Listar mantenimientos)`);
      console.log(`  - POST   /api/mantenimientos         (Crear mantenimiento)`);
      console.log(`  - GET    /api/estados                (Ver historial de estados)`);
      console.log('');
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();

export default app;
