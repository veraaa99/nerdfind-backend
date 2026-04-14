import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      userInfo: {
        _id: user._id,
        email: user.email,
      },
    },
    process.env.SECRET_ACCESS_TOKEN,
    { expiresIn: "2h" },
  );
};
