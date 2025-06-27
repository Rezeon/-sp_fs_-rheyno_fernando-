import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return jwt.verify(token, JWT_SECRET);
}
