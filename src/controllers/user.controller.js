import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
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
};

export const getUsers = async (req, res) => {
  const users = await User.find().exec();

  if (!users || users.length == 0) {
    return res.status(404).json({ message: "Inga användare hittades" });
  }

  res.status(200).json(users);
};
