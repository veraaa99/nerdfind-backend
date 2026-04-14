import Listing from "../models/listing.model.js";

export const createListing = async (req, res) => {
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
    host,
  } = req.body;

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
    host,
  });

  res.status(201).json(listing);
};
