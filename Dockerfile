# Dockerfile para la API de Control de Vehículos
FROM node:20-alpine

# Metadata labels
LABEL org.opencontainers.image.title="Vehicle Control API"
LABEL org.opencontainers.image.description="REST API for vehicle control and management with PostgreSQL"
LABEL org.opencontainers.image.authors="JuanMM94"
LABEL org.opencontainers.image.source="https://github.com/JuanMM94/vehiculo-control-api"
LABEL org.opencontainers.image.documentation="https://github.com/JuanMM94/vehiculo-control-api#readme"
LABEL org.opencontainers.image.url="https://hub.docker.com/r/juanmartinm/vehiculo-control-api"

# Variables de entorno para build
ENV NODE_ENV=production

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el resto de archivos del proyecto
COPY . .

# Exponer el puerto
EXPOSE 3000

# Variables de entorno por defecto (pueden sobreescribirse en docker-compose)
ENV PORT=3000

# Iniciar la aplicación
CMD ["npm", "start"]
