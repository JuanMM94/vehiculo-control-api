# Dockerfile para la API de Control de Vehículos
FROM node:20-alpine

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
