import express from 'express';
import dotenv from "dotenv";
import * as routes from "../controllers/RoutesController";


const app = express();

// loads dotenv configuration
dotenv.config();

// register routes
routes.register(app);

// run server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});