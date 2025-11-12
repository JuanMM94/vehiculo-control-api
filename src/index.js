import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import sequelize, { testConnection, syncDatabase, createDatabaseIfNotExists } from "./config/database.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import swaggerSpec from "./config/swagger.js";
import { VERSION } from "./utils/version.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    mensaje: "Bienvenido a la API de Control de Vehículos",
    version: VERSION,
    documentacion: "/api/api-docs",
    api: "/api",
  });
});

app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    console.log("Creando base de datos si no existe...");
    await createDatabaseIfNotExists();

    console.log("Verificando conexión a la base de datos...");
    const connected = await testConnection();

    if (!connected) {
      console.error(
        "No se pudo conectar a la base de datos. Abortando inicio del servidor."
      );
      process.exit(1);
    }

    console.log("Sincronizando modelos con la base de datos...");
    await syncDatabase({
      alter: process.env.NODE_ENV === "development",
    });

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en puerto: ${PORT}`);
      console.log(`Entorno: ${process.env.NODE_ENV || "production"}`);
      console.log(`Base de datos: ${process.env.DB_NAME}`);
      console.log(`Swagger UI disponible en: http://localhost:${PORT}/api/api-docs`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
