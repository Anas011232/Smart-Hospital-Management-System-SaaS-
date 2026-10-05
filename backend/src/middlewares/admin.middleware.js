import jwt from "jsonwebtoken";

export const adminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const parts = authHeader.split(" ");
    const token = parts.length === 2 && parts[0] === "Bearer" ? parts[1] : null;

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Super Admin access required.",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Token invalid or expired.",
    });
  }
};
