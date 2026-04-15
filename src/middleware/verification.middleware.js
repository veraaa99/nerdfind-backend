import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHandler = req.headers.authorization || req.headers.Authorization;
    if (!authHandler || !authHandler.includes("Bearer")) {
      return res
        .status(401)
        .json({ message: "Du är inte verifierad. Ingen token angavs" });
    }

    const token = authHandler.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);

    req.user = decoded.userInfo;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Du är inte verifierad" });
  }
};

export const verifyHost = (isHost) => {
  return (req, res, next) => {
    if (!req.user.isHost == isHost) {
      return res.status(403).json({
        message:
          "Åtkomst nekad: Denna åtgärd kan endast utföras av ett konto som tillhör en arrangör.",
      });
    }

    next();
  };
};
