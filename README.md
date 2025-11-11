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
- ✅ Documentación con Swagger/OpenAPI

## Tecnologías Utilizadas

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- JWT
- bcryptjs
- Jest
- Docker
- Swagger/OpenAPI

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
npm run docker:up
```

Esto levantará:
- PostgreSQL en puerto 5432
- API en puerto 3000

3. Verificar que todo funciona:
```bash
curl http://localhost:3000/api
```

4. Acceder a Swagger UI:
```
http://localhost:3000/api-docs
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

## Documentación de la API

La API cuenta con documentación interactiva usando Swagger/OpenAPI disponible en:

```
http://localhost:3000/api-docs
```

### Uso de Swagger UI

1. Navegar a http://localhost:3000/api-docs
2. Crear un usuario con `/api/usuarios/register`
3. Iniciar sesión con `/api/usuarios/login` para obtener el token JWT
4. Hacer clic en el botón **"Authorize"** (candado verde)
5. Ingresar: `Bearer YOUR_TOKEN_HERE`
6. Ahora puedes probar todos los endpoints protegidos

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

#### Iniciar Sesión
```http
POST /api/usuarios/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Vehículos

Ver documentación completa en Swagger UI: http://localhost:3000/api-docs

**Principales endpoints:**
- `GET /api/vehiculos` - Listar vehículos
- `POST /api/vehiculos` - Crear vehículo (Admin)
- `PATCH /api/vehiculos/:id/estado` - Cambiar estado
- `GET /api/vehiculos/estado/:estado` - Filtrar por estado

### Mantenimientos

**Principales endpoints:**
- `GET /api/mantenimientos` - Listar mantenimientos
- `POST /api/mantenimientos` - Crear mantenimiento
- `PATCH /api/mantenimientos/:id/finalizar` - Finalizar mantenimiento

### Estados (Historial)

**Principales endpoints:**
- `GET /api/estados` - Ver todo el historial
- `GET /api/estados/vehiculo/:vehiculoId` - Historial de un vehículo

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

## Comandos Docker

```bash
# Iniciar contenedores
npm run docker:up

# Detener contenedores
npm run docker:down

# Ver logs en tiempo real
npm run docker:logs
```

## Docker Hub

La imagen está disponible en Docker Hub:

```bash
docker pull <DOCKER_USERNAME>/vehiculo-control-api:latest
```

Para ejecutar desde Docker Hub:

```bash
docker run -p 3000:3000 \
  -e DB_HOST=your-db-host \
  -e DB_NAME=vehiculo_control \
  -e DB_USER=postgres \
  -e DB_PASSWORD=your-password \
  -e JWT_SECRET=your-secret \
  <DOCKER_USERNAME>/vehiculo-control-api:latest
```

## CI/CD

El proyecto incluye un pipeline de GitHub Actions (`.github/workflows/docker-publish.yml`) que:

1. Construye la imagen Docker automáticamente en cada push a `main`
2. Sube la imagen a Docker Hub
3. Genera tags apropiados (latest, sha, version)
4. Soporta múltiples plataformas (amd64, arm64)

### Configuración del Pipeline

Agregar los siguientes secrets en GitHub:
- `DOCKER_USERNAME`: Tu usuario de Docker Hub
- `DOCKER_PASSWORD`: Tu password o token de Docker Hub

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
