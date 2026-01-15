import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../DBModels/Admin.js";

const ADMIN_DEFAULT_USERNAME = process.env.ADMIN_DEFAULT_USERNAME;
const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD ; // change later

const JWT_SECRET = process.env.Admin_JWT_SECRET ;
const ADMIN_COOKIE = "admin_token";

const signAdminToken = (adminId) => {
  return jwt.sign({ adminId, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Manual hit route: creates default admin if not exists
export const DefaultCreateAdmin = async (req, res) => {
  try {
    const exists = await Admin.findOne({ username: ADMIN_DEFAULT_USERNAME }).lean();
    if (exists) {
      return res.json({ success: true, message: "Admin already exists", username: exists.username });
    }

    const passwordHash = await bcrypt.hash(ADMIN_DEFAULT_PASSWORD, 10);
    const admin = await Admin.create({ username: ADMIN_DEFAULT_USERNAME, passwordHash });

    return res.json({
      success: true,
      message: "Default admin created",
      username: admin.username,
      // NOTE: password show na karna better hota hai (but you can show in dev if you want)
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ Admin login
export const adminLogin = async (req, res) => {
  try {
    const username = String(req.body.username || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username & password required" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = signAdminToken(admin._id);

    res.cookie(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true, // production me true + https
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Logged in", admin: { username: admin.username } });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ Check current admin (session)
export const adminMe = async (req, res) => {
  try {
    const token = req.cookies?.[ADMIN_COOKIE];
    if (!token) return res.json({ success: true, admin: null });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.json({ success: true, admin: null });
    }

    const admin = await Admin.findById(decoded.adminId).select("username").lean();
    if (!admin) return res.json({ success: true, admin: null });

    return res.json({ success: true, admin: { username: admin.username } });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ Logout
export const adminLogout = async (req, res) => {
  res.clearCookie(ADMIN_COOKIE, { httpOnly: true, sameSite: "lax", secure: false });
  return res.json({ success: true, message: "Logged out" });
};
