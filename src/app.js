import express from "express";
import listingRoutes from "./routes/listing.route.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/listings", listingRoutes);
app.use("/api/users", userRoutes);

export default app;
