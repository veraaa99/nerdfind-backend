import express from "express";
import listingRoutes from "./routes/listing.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

app.use(express.json());

app.use("/api/listings", listingRoutes);
app.use("/api/users", userRoutes);

export default app;
