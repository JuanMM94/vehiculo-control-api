import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import sequelize, { testConnection, syncDatabase } from "./config/database.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
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
      console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
      console.log(`Base de datos: ${process.env.DB_NAME}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();

export default app;
