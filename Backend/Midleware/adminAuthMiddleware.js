import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.Admin_JWT_SECRET ;
const ADMIN_COOKIE = "admin_token";

export default function adminAuthMiddleware(req, res, next) {
  try {
    const token = req.cookies?.[ADMIN_COOKIE];
    if (!token) return res.status(401).json({ success: false, message: "Admin not authenticated" });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded?.role !== "admin") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.adminId = decoded.adminId;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Invalid admin token" });
  }
}
