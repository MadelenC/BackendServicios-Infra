  import express from "express";
  import cors from "cors";
  import dotenv from "dotenv";
  import userRoutes from "./routes/userRoutes.js";
  import authRoutes from "./routes/authRoutes.js"; 
  import entidadesRoutes from "./routes/entidadesRoutes.js";
  import applicationRoutes from "./routes/applicationRoutes.js"
  import maintenanceRoutes from "./routes/maintenanceRoutes.js"
  import institutionRoutes from "./routes/institutionRoutes.js"
  import requestRoutes from "./routes/requestRoutes.js"
  import OrderservRoutes from "./routes/orderservRoutes.js"
  import VehicleRoutes from "./routes/vehicleRoutes.js"
  import accessoriesRoutes  from "./routes/accesoriesRoutes.js";
  dotenv.config();

  const app = express();
  app.use(express.json());

  app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', "PATCH", ],
    credentials: true
  }));

  // Rutas
  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes); 
  app.use("/uploads", express.static("uploads"));
  app.use("/api/entidades", entidadesRoutes);
  app.use("/api/solicitudes",applicationRoutes);
  app.use("/api/mantenimiento",maintenanceRoutes);//serviciosa
  app.use("/api/institucion",institutionRoutes);//servicos
  app.use("/api/peticiones",requestRoutes);
  app.use("/api/pedidoserv", OrderservRoutes);//srvicos
  app.use("/api/vehiculos", VehicleRoutes);//srvicos
  app.use("/api/accesorios", accessoriesRoutes);//srvicos
  export default app;