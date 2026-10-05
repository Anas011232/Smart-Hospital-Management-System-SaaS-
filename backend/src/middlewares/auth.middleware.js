// import jwt from "jsonwebtoken";

// export const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const parts = authHeader.split(" ");
    const token = parts.length === 2 && parts[0] === "Bearer" ? parts[1] : null;

    if (!token || token === "null" || token === "undefined" || token === "false") {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};