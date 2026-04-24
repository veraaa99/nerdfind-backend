import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isHost: {
    type: Boolean,
    required: true,
  },
  savedListings: {
    type: mongoose.Schema.Types.Array,
    ref: "Listing",
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
