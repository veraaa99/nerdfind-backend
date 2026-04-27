import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateToken } from "../token/webToken.js";
import Listing from "../models/listing.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, isHost } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Fel: vänligen ange alla fält" });
  }

  if (confirmPassword !== password) {
    return res.status(400).json({ message: "Lösenorden matchar inte" });
  }

  const trimmedEmail = email.toLowerCase().trim().replace(/\s/g, "");
  const existingUser = await User.findOne({ email: trimmedEmail });

  if (existingUser) {
    return res.status(401).json({
      message:
        "Denna epostadress används redan av ett annant konto. Vänligen ange en annan epostadress",
    });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    isHost: isHost,
  });

  const userToken = generateToken(user);

  res
    .status(201)
    .json({ _id: user._id, email: trimmedEmail, userToken: userToken });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Fel: vänligen ange alla fält" });
  }

  const trimmedEmail = email.toLowerCase().trim().replace(/\s/g, "");
  const user = await User.findOne({ email: trimmedEmail }).exec();

  if (!user) {
    return res.status(401).json({
      message: "Fel: Vi kunde inte hitta en användare med denna epostadress",
    });
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return res.status(400).json({ message: "Fel lösenord" });
  }

  const userToken = generateToken(user);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isHost: user.isHost,
    userToken: userToken,
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().exec();

  if (!users || users.length == 0) {
    return res.status(404).json({ message: "Inga användare hittades" });
  }

  res.status(200).json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password").exec();

  if (!user) {
    return res.status(404).json({ message: "Användaren kunde inte hittas" });
  }

  res.status(200).json(user);
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id, "-password").exec();
  if (!user) {
    return res.status(404).json({ message: "Användaren kunde inte hittas" });
  }

  res.status(200).json(user);
});

export const checkToken = asyncHandler(async (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    email: req.user.email,
    isHost: req.user.isHost,
  });
});

export const saveListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  const user = await User.findById(req.user._id, "-password").exec();

  if (!user) {
    return res.status(404).json({
      message:
        "Fel: Användaren kunde inte hittas. Du behöver vara inloggad för att kunna spara en annons",
    });
  }

  const listing = await Listing.findById(listingId).exec();

  if (!listing) {
    return res.status(404).json({ message: "Fel: Annonen kunde inte hittas" });
  }

  const isListingSaved = user.savedListings.includes(listingId);

  if (isListingSaved) {
    user.savedListings = user.savedListings.filter(
      (id) => id.toString() !== listingId,
    );
  } else {
    user.savedListings.push(listingId);
  }

  await user.save();

  res
    .status(200)
    .json({ savedListings: user.savedListings, saved: !isListingSaved });
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
