import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  if (!name || !email || !password || !isAdmin) {
    return res.status(400).json({ message: "Fel: vänligen ange alla fält" });
  }

  const user = await User.create({
    name: name,
    email: email,
    password: password,
    isAdmin: isAdmin,
  });

  res.status(201).json(user);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Fel: vänligen ange alla fält" });
  }

  const user = await User.findOne({ email: email }).exec();

  if (!user) {
    return res.status(401).json({
      message: "Fel: Vi kunde inte hitta en användare med denna epostadress",
    });
  }

  res.status(200).json({ _id: user._id, name: user.name, email: user.email });
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
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(404).json({ message: "Användaren kunde inte hittas" });
  }

  res.status(200).json(user);
});
