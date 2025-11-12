# Vehicle Control API

API REST para control y gestión de vehículos construida con Node.js, Express y PostgreSQL.

## Inicio Rápido con Docker Compose

La forma más fácil de ejecutar esta aplicación es con Docker Compose:

```bash
# Descargar el archivo compose de producción
curl -O https://raw.githubusercontent.com/JuanMM94/vehiculo-control-api/main/docker-compose.prod.yml

# Iniciar la aplicación (API + PostgreSQL)
docker compose -f docker-compose.prod.yml up -d
```

Esto hará lo siguiente:
- Descargar e iniciar PostgreSQL 16
- Descargar e iniciar la API en el puerto 3000
- Crear automáticamente la base de datos y las tablas
- Configurar la red entre contenedores

## Acceso a la Aplicación

- **URL Base de la API**: http://localhost:3000/api
- **Documentación Swagger**: http://localhost:3000/api/api-docs

## Variables de Entorno Requeridas

Si deseas ejecutar el contenedor individualmente (no recomendado), debes proporcionar:

- `DB_HOST` - Host de PostgreSQL (default: localhost)
- `DB_PORT` - Puerto de PostgreSQL (default: 5432)
- `DB_NAME` - Nombre de la base de datos
- `DB_USER` - Usuario de la base de datos
- `DB_PASSWORD` - Contraseña de la base de datos
- `JWT_SECRET` - Clave secreta para tokens JWT
- `PORT` - Puerto de la API (default: 3000)

## Documentación

Documentación completa disponible en: https://github.com/JuanMM94/vehiculo-control-api
