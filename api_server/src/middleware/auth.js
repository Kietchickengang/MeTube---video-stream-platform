import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "toiyeuuit";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies?.metube_token;
  console.log("COOKIE TOKEN:", req.cookies?.metube_token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;

    next();
  } 
  catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
