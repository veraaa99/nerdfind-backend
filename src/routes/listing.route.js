import express from "express";
import {
  createListing,
  getListingById,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../middleware/verification.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createListing);

router.get("/", getListings);
router.get("/:id", getListingById);

export default router;
