import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(token) {
  if (!token) throw new Error("Token is required");

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Token is malformed or invalid");
  }
}
