import express from "express";
import {
  createListing,
  getListingById,
  getListings,
} from "../controllers/listing.controller.js";
import {
  verifyHost,
  verifyToken,
} from "../middleware/verification.middleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyHost(true), createListing);

router.get("/", getListings);
router.get("/:id", getListingById);

export default router;
