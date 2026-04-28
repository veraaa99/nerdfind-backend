import express from "express";
import {
  createListing,
  getListingById,
  getListings,
  getListingsByFilter,
  getUserCreatedListings,
  getUserSavedListings,
} from "../controllers/listing.controller.js";
import {
  verifyHost,
  verifyToken,
} from "../middleware/verification.middleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyHost(true), createListing);

router.get("/", getListings);
router.get("/search", getListingsByFilter);
router.get("/savedlistings", verifyToken, getUserSavedListings);
router.get(
  "/createdlistings",
  verifyToken,
  verifyHost(true),
  getUserCreatedListings,
);
router.get("/:id", getListingById);

export default router;
