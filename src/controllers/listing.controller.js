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

export const getListingsByFilter = asyncHandler(async (req, res) => {
  const query = req.query;
  const numberOfFilters = Object.keys(query).length;
  const listings = await Listing.find().exec();

  let filteredListings = [];

  if (numberOfFilters > 0) {
    filteredListings = listings.filter((listing) => {
      // Location
      if (query.location) {
        if (Array.isArray(query.location)) {
          const locations = query.location.map((location) =>
            location.toLowerCase(),
          );
          if (
            !locations.some((l) =>
              listing.location.city.toLowerCase().includes(l),
            )
          ) {
            return false;
          }
        } else {
          if (
            !listing.location.city
              .toLowerCase()
              .includes(query.location.toLowerCase())
          ) {
            return false;
          }
        }
      }

      // Type
      if (query.type) {
        if (listing.type.toLowerCase() !== query.type.toLowerCase()) {
          return false;
        }
      }

      // Category
      if (query.category) {
        if (listing.category.predefinedCategory) {
          if (Array.isArray(query.category)) {
            const queryCategories = query.category.map((category) =>
              category.toLowerCase(),
            );
            const listingCategories = listing.category.predefinedCategory.map(
              (category) => category.toLowerCase(),
            );

            const matchingCategories = listingCategories.filter((category) =>
              queryCategories.includes(category.toLowerCase()),
            );

            if (matchingCategories.length > 0) {
              return true;
            } else {
              return false;
            }
          } else {
            const listingCategories = listing.category.predefinedCategory.map(
              (category) => category.toLowerCase(),
            );

            if (listingCategories.includes(query.category.toLowerCase())) {
              return true;
            } else {
              return false;
            }
          }
        }

        if (listing.category.customCategory) {
          if (Array.isArray(query.category)) {
            const queryCategories = query.category.map((category) =>
              category.toLowerCase(),
            );
            const listingCategories = listing.category.customCategory.map(
              (category) => category.toLowerCase(),
            );

            const matchingCategories = listingCategories.filter((category) =>
              queryCategories.includes(category.toLowerCase()),
            );

            console.log(matchingCategories);

            if (matchingCategories.length > 0) {
              return true;
            } else {
              return false;
            }
          } else {
            const listingCategories = listing.category.customCategory.map(
              (category) => category.toLowerCase(),
            );

            if (listingCategories.includes(category.toLowerCase())) {
              return true;
            } else {
              return false;
            }
          }
        }
      }

      // searchString
      if (query.searchString) {
        const string = query.searchString.toLowerCase().trim();

        if (listing.title.toLowerCase().includes(string)) {
          return true;
        } else if (listing.location.city.toLowerCase().includes(string)) {
          return true;
        } else if (listing.type.toLowerCase().includes(string)) {
          return true;
        } else if (listing.description.toLowerCase().includes(string)) {
          return true;
        } else if (
          listing.category.predefinedCategory &&
          listing.category.predefinedCategory.filter((category) =>
            category.toLowerCase().includes(string),
          ).length > 0
        ) {
          return true;
        } else if (
          listing.category.customCategory &&
          listing.category.customCategory.filter((category) =>
            category.toLowerCase().includes(string),
          ).length > 0
        ) {
          return true;
        } else {
          return false;
        }
      }

      return true;
    });
  }

  console.log(filteredListings);

  res.status(200).json(filteredListings);
});

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
