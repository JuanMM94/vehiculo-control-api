import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vehicle Control API',
      version: '1.0.0',
      description: 'API REST para control y gestión del estado de vehículos',
      contact: {
        name: 'Juan Martín Monasterio',
        email: 'juan@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            nombre: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            rol: {
              type: 'string',
              enum: ['Administrador', 'Operador'],
            },
          },
        },
        Vehiculo: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            patente: {
              type: 'string',
            },
            marca: {
              type: 'string',
            },
            modelo: {
              type: 'string',
            },
            año: {
              type: 'integer',
            },
            estadoActual: {
              type: 'string',
              enum: ['Disponible', 'En uso', 'En mantenimiento', 'Dado de baja'],
            },
          },
        },
        EstadoVehiculo: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            vehiculoId: {
              type: 'string',
              format: 'uuid',
            },
            fecha: {
              type: 'string',
              format: 'date-time',
            },
            estado: {
              type: 'string',
              enum: ['Disponible', 'En uso', 'En mantenimiento', 'Dado de baja'],
            },
            observaciones: {
              type: 'string',
            },
          },
        },
        Mantenimiento: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            vehiculoId: {
              type: 'string',
              format: 'uuid',
            },
            estadoVehiculoId: {
              type: 'string',
              format: 'uuid',
            },
            fechaInicio: {
              type: 'string',
              format: 'date-time',
            },
            fechaFin: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            descripcion: {
              type: 'string',
            },
            costo: {
              type: 'number',
              format: 'float',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            mensaje: {
              type: 'string',
            },
            error: {
              type: 'string',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
