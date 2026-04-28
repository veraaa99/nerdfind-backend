import ImageKit from "imagekit";
import Listing from "../models/listing.model.js";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const createListing = asyncHandler(async (req, res) => {
  let {
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

  if (date == "" || !date) {
    date = undefined;
  }

  if (website == "" || !website) {
    website = undefined;
  }

  if (req.user.isHost == false) {
    return res.status(403).json({
      message:
        "Åtkomst nekad: Denna åtgärd kan endast utföras av ett konto som tillhör en arrangör.",
    });
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

export const getImageKitAuth = (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  res.json(authParams);
};

export const getUserSavedListings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id, "-password").populate(
    "savedListings",
  );

  if (!user) {
    return res.status(404).json({
      message: "Fel: Användaren kunde inte hittas.",
    });
  }

  res.status(200).json(user.savedListings);
});

export const getUserCreatedListings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id, "-password").exec();

  if (!user) {
    return res.status(404).json({
      message: "Fel: Användaren kunde inte hittas.",
    });
  }
  if (user.isHost == false) {
    return res.status(403).json({
      message:
        "Åtkomst nekad: Detta är inte ett företagskonto och kan inte skapa nya annonser.",
    });
  }

  const userCreatedListings = await Listing.find({ host: user._id }).exec();

  if (userCreatedListings.length == 0) {
    return res.status(200).json({
      message: "Inga annonser sparade än.",
    });
  }

  res.status(200).json(userCreatedListings);
});
