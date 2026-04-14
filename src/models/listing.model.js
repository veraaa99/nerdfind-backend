import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
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
  },
  { _id: false },
);

const openingHoursSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    times: [
      {
        start: {
          type: String,
          required: true,
        },
        end: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { _id: false },
);

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ["Event", "Butik", "Mässa", "Loppis"],
    required: true,
  },
  category: {
    predefinedCategory: {
      type: [String],
      enum: [
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

  openingHours: {
    type: [openingHoursSchema],
    default: [],
  },

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

// 🌍 Geo index (SUPER viktigt för sök!)
listingSchema.index({ location: "2dsphere" });

// 🔍 Text search index
listingSchema.index({
  title: "text",
  description: "text",
});

// ⚡ Kombinerade index (för filter)
listingSchema.index({ type: 1, date: 1 });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
