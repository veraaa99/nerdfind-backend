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
      type: String,
      required: true,
      min: 1,
    },
    times: {
      start: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            if (this.start === "STÄNGT") return v == null;
            return true;
          },
          message: "end kan inte sättas om start är 'STÄNGT'",
        },
      },
      end: {
        type: String,
        required: false,
      },
    },
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
    required: false,
  },

  openingHours: {
    type: [openingHoursSchema],
    default: [],
    validate: {
      validator: function (items) {
        const days = items.map((i) => i.day);
        return new Set(days).size === days.length;
      },
      message: "Vänligen välj en dag som inte redan är vald",
    },
  },

  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
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
    required: true,
  },
});

// QUERY INDEX FUNCTIONS
listingSchema.index({ location: "2dsphere" });

listingSchema.index({
  title: "text",
  description: "text",
});

listingSchema.index({ type: 1, date: 1 });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
