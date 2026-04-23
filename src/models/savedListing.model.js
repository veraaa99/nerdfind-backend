import mongoose from "mongoose";

const savedListingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  _id: false,
});

const SavedListing = mongoose.model("SavedListing", savedListingSchema);

export default SavedListing;
