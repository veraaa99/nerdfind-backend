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
      choices: [
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
    type: Date,
    required: true,
  },

  // Source - https://stackoverflow.com/a/58731454
  // Posted by fseb
  // Retrieved 2026-04-13, License - CC BY-SA 4.0
  openingHours: [
    {
      day: { type: Date }, //mon - sun
      times: [
        {
          start: { type: Date },
          end: { type: Date },
        },
      ],
    },
  ],

  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  website: {
    type: String,
    required: false,
  },

  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
