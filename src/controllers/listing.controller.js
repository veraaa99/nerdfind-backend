import Listing from "../models/listing.model.js";
import asyncHandler from "express-async-handler";

export const createListing = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    category,
    images,
    date,
    openingHours,
    location,
    website,
  } = req.body;
  const host = req.user._id;

  if (
    !title ||
    !description ||
    !type ||
    !category ||
    !images ||
    !date ||
    !openingHours ||
    !location
  ) {
    return res
      .status(400)
      .json({ message: "Fel: vänligen ange alla obligatoriska fält" });
  }

  if (website == "" || !website) {
    website = undefined;
  }

  const listing = await Listing.create({
    title,
    description,
    type,
    category,
    images,
    date,
    openingHours,
    location,
    website,
    host: host,
  });

  res.status(201).json(listing);
});

export const getListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find().exec();

  if (!listings) {
    return res.status(404).json({ message: "Inga annonser kunde hittas" });
  }

  res.status(200).json(listings);
});

export const getListingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id).exec();

  if (!listing) {
    return res.status(404).json({ message: "Annonen kunde inte hittas" });
  }

  res.status(200).json(listing);
});
