# API de Control de Vehículos

Sistema de control y gestión del estado de vehículos desarrollado con Node.js, Express y PostgreSQL.

## Autor

- **Nombre:** Juan Martín Monasterio
- **Legajo:** 0133587
- **Materia:** Técnicas Avanzadas de Programación

## Descripción del Proyecto

API REST que permite llevar adelante el control del estado de los vehículos, implementando:

- ✅ Modelo cliente-servidor
- ✅ API desacoplada del frontend
- ✅ Paradigma de objetos (OOP)
- ✅ Inyección de dependencias entre objetos
- ✅ Autenticación con JWT
- ✅ Validaciones de negocio
- ✅ Testing unitario e integración
- ✅ Dockerización

## Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 20.x | Runtime de JavaScript |
| Express.js | 5.x | Framework web para APIs REST |
| PostgreSQL | 16.x | Base de datos relacional |
| Sequelize | 6.x | ORM para PostgreSQL |
| JWT | 9.x | Autenticación y autorización |
| bcryptjs | 3.x | Encriptación de contraseñas |
| Jest | 30.x | Testing unitario e integración |
| Docker | - | Containerización y despliegue |

## Arquitectura

El proyecto sigue una arquitectura en capas:

```
src/
├── config/          # Configuración de BD y aplicación
├── models/          # Modelos de Sequelize (Capa de datos)
├── services/        # Lógica de negocio (con DI)
├── controllers/     # Controladores de rutas
├── routes/          # Definición de endpoints
├── middlewares/     # Middlewares (auth, errores)
└── utils/           # Utilidades (auth helpers)
```

### Inyección de Dependencias

El proyecto implementa **Dependency Injection** en la capa de servicios:

- **VehiculoService**: Recibe `VehiculoRepository` como dependencia
- **MantenimientoService**: Recibe `MantenimientoRepository` y `VehiculoRepository` (demuestra DI entre múltiples objetos)
- **ServiceContainer**: Contenedor que gestiona la creación e inyección de dependencias

## Modelo de Datos

### Diagrama de Relaciones

```
Usuario (1) ----gestiona----> (*) Vehiculo
                                    |
                                    | (1)
                                    |
                                    v (*)
                              EstadoVehiculo
                                    ^
                                    | (1)
                                    |
Mantenimiento (*)----------asociado---
       |
       | (*)
       |
       v (1)
    Vehiculo
```

### Entidades

#### Usuario
- `id`: UUID (PK)
- `nombre`: String
- `email`: String (único)
- `password`: String (hasheado)
- `rol`: ENUM ('Administrador', 'Operador')

#### Vehiculo
- `id`: UUID (PK)
- `patente`: String (único)
- `marca`: String
- `modelo`: String
- `año`: Number
- `estadoActual`: ENUM ('Disponible', 'En uso', 'En mantenimiento', 'Dado de baja')

#### EstadoVehiculo (Historial)
- `id`: UUID (PK)
- `vehiculoId`: UUID (FK -> Vehiculo)
- `fecha`: DateTime
- `estado`: ENUM
- `observaciones`: String

#### Mantenimiento
- `id`: UUID (PK)
- `vehiculoId`: UUID (FK -> Vehiculo)
- `estadoVehiculoId`: UUID (FK -> EstadoVehiculo) - **Relación según feedback del profesor**
- `fechaInicio`: Date
- `fechaFin`: Date (nullable)
- `descripcion`: String
- `costo`: Number

## Instalación y Configuración

### Prerequisitos

- Node.js 20.x o superior
- Docker y Docker Compose (recomendado)
- PostgreSQL 16.x (si no usas Docker)

### Opción 1: Con Docker (Recomendado)

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd vehiculo-control-api
```

2. Iniciar con Docker Compose:
```bash
docker-compose up -d
```

Esto levantará:
- PostgreSQL en puerto 5432
- API en puerto 3000

3. Verificar que todo funciona:
```bash
curl http://localhost:3000/api
```

### Opción 2: Instalación Local

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd vehiculo-control-api
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Asegurarse de que PostgreSQL está corriendo y crear la base de datos:
```sql
CREATE DATABASE vehiculo_control;
```

5. Iniciar la aplicación:
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## Variables de Entorno

Crear un archivo `.env` basado en `.env.example`:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=vehiculo_control
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=tu-secreto-super-seguro
JWT_EXPIRES_IN=24h

CORS_ORIGIN=*
```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Autenticación

#### Registrar Usuario
```http
POST /api/usuarios/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol": "Operador"
}
```

**Respuesta:**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "Operador"
  },
  "token": "jwt-token"
}
```

#### Iniciar Sesión
```http
POST /api/usuarios/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "mensaje": "Login exitoso",
  "usuario": { ... },
  "token": "jwt-token"
}
```

### Vehículos

#### Listar Todos los Vehículos
```http
GET /api/vehiculos
Authorization: Bearer {token}
```

#### Obtener Vehículo por ID
```http
GET /api/vehiculos/:id?incluirHistorial=true
Authorization: Bearer {token}
```

#### Crear Vehículo (Solo Administradores)
```http
POST /api/vehiculos
Authorization: Bearer {token}
Content-Type: application/json

{
  "patente": "ABC123",
  "marca": "Toyota",
  "modelo": "Corolla",
  "año": 2023,
  "estadoActual": "Disponible"
}
```

#### Cambiar Estado de Vehículo
```http
PATCH /api/vehiculos/:id/estado
Authorization: Bearer {token}
Content-Type: application/json

{
  "estado": "En uso",
  "observaciones": "Asignado a proyecto X"
}
```

**Estados válidos:**
- `Disponible`
- `En uso`
- `En mantenimiento`
- `Dado de baja`

**Validaciones:**
- No se puede cambiar de "En uso" a "En mantenimiento" directamente
- No se puede cambiar de "En mantenimiento" a "En uso" directamente
- Primero debe pasar por "Disponible"

### Mantenimientos

#### Listar Mantenimientos
```http
GET /api/mantenimientos
Authorization: Bearer {token}
```

#### Obtener Mantenimientos de un Vehículo
```http
GET /api/mantenimientos/vehiculo/:vehiculoId
Authorization: Bearer {token}
```

#### Crear Mantenimiento
```http
POST /api/mantenimientos
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehiculoId": "uuid-del-vehiculo",
  "fechaInicio": "2025-01-10T10:00:00Z",
  "descripcion": "Cambio de aceite y filtros",
  "costo": 5000
}
```

**Comportamiento:**
- Crea el mantenimiento
- Crea un registro en EstadoVehiculo asociado al mantenimiento
- Cambia el estado del vehículo a "En mantenimiento"

#### Finalizar Mantenimiento
```http
PATCH /api/mantenimientos/:id/finalizar
Authorization: Bearer {token}
Content-Type: application/json

{
  "fechaFin": "2025-01-11T16:00:00Z",
  "costo": 5500
}
```

**Comportamiento:**
- Marca el mantenimiento como finalizado
- Cambia el estado del vehículo a "Disponible"

### Historial de Estados

#### Ver Todo el Historial
```http
GET /api/estados
Authorization: Bearer {token}
```

#### Ver Historial de un Vehículo
```http
GET /api/estados/vehiculo/:vehiculoId
Authorization: Bearer {token}
```

## Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ver cobertura de tests
npm test -- --coverage
```

### Tipos de Tests Implementados

#### Tests Unitarios
- **VehiculoService**: Testing de lógica de negocio con mocks
- **MantenimientoService**: Testing con múltiples dependencias inyectadas

#### Tests de Integración
- **Autenticación**: Tests end-to-end de registro y login

### Módulos Testeados

Según el plan de trabajo:
- ✅ Módulo de autenticación de usuarios
- ✅ Alta, modificación y baja lógica de vehículos
- ✅ Cambio de estado de vehículo y registro en historial
- ✅ Módulo de gestión de mantenimientos
- ✅ Validaciones de negocio (estados incompatibles)

## Roles y Permisos

### Operador
- ✅ Ver vehículos
- ✅ Cambiar estado de vehículos
- ✅ Crear mantenimientos
- ✅ Finalizar mantenimientos
- ✅ Ver historial

### Administrador
- ✅ Todo lo del Operador
- ✅ Crear/editar/eliminar vehículos
- ✅ Crear/editar/eliminar usuarios
- ✅ Editar/eliminar mantenimientos

## Validaciones de Negocio

1. **Patente única**: No puede haber dos vehículos con la misma patente
2. **Estados mutuamente excluyentes**:
   - Un vehículo no puede estar "En uso" y "En mantenimiento" simultáneamente
   - Para cambiar entre estos estados, debe pasar primero por "Disponible"
3. **Mantenimiento de vehículos en uso**: No se puede iniciar mantenimiento en un vehículo que está "En uso"
4. **Fechas de mantenimiento**: La fecha de fin debe ser posterior a la fecha de inicio

## Scripts Disponibles

```json
{
  "start": "node src/index.js",           // Iniciar en producción
  "dev": "nodemon src/index.js",          // Desarrollo con hot-reload
  "test": "jest",                         // Ejecutar tests
  "test:watch": "jest --watch",           // Tests en modo watch
  "lint": "eslint .",                     // Linting
  "lint:fix": "eslint . --fix"            // Fix linting automático
}
```

## Estructura de Respuestas

### Éxito
```json
{
  "mensaje": "Operación exitosa",
  "data": { ... }
}
```

### Error
```json
{
  "error": "Descripción del error"
}
```

### Error de Validación
```json
{
  "error": "Error de validación",
  "detalles": [
    {
      "campo": "email",
      "mensaje": "El email ya está en uso"
    }
  ]
}
```

## Decisiones Técnicas

### ¿Por qué JavaScript ES6+ en lugar de TypeScript?
- Implementación más rápida para MVP
- Menor complejidad de configuración
- Suficiente para demostrar patrones de diseño (OOP, DI)
- Uso de JSDoc para documentación de tipos cuando es necesario

### ¿Por qué Sequelize?
- ORM maduro y estable
- Excelente integración con PostgreSQL
- Facilita el modelo de objetos
- Migraciones y seeders incluidos

### ¿Por qué Service Repository Pattern?
- Separa la lógica de negocio del acceso a datos
- Facilita el testing con mocks
- Permite implementar DI de forma clara
- Cumple con principios SOLID

## Próximos Pasos / Mejoras Futuras

- [ ] Implementar sistema de notificaciones
- [ ] Agregar endpoints de reportes y estadísticas
- [ ] Implementar paginación en listados
- [ ] Agregar más tests de integración
- [ ] Documentación con Swagger/OpenAPI
- [ ] Implementar rate limiting
- [ ] Agregar logs estructurados
- [ ] CI/CD con GitHub Actions

## Problemas Conocidos

Ninguno reportado actualmente.

## Soporte

Para dudas o problemas, contactar a:
- Email: [tu-email]
- Legajo: 0133587

## Licencia

ISC - Proyecto académico para Técnicas Avanzadas de Programación
