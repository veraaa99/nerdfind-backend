import express from "express";
import {
  createListing,
  getListingById,
  getListings,
} from "../controllers/listing.controller.js";

const router = express.Router();

router.post("/", createListing);

router.get("/", getListings);
router.get("/:id", getListingById);

export default router;
