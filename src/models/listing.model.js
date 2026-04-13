import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "",
  },
});

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: ["Event", "Butik", "Mässa", "Loppis"],
  category: {
    predefinedCategory: {
      type: [String],
      choises: [
        "Tv-spel",
        "Sci-fi",
        "Serietidningar",
        "Cosplay",
        "Anime",
        "Manga",
        "Rollspel",
      ],
      default: [],
      required: false,
    },
    customCategory: {
      type: [String],
      default: [],
      required: false,
    },
  },

  images: {
    type: [imageSchema],
    default: [],
    required: true,
  },

  date: {
    type: 
  }

  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});
