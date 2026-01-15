import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../DBModels/UserProfile.js";


const MAX_ATTEMPTS = 10;
const LOCK_MINUTES = 5;

const AuthLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = String(email || "").trim().toLowerCase();

    // ✅ Email check
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    // ✅ If locked -> block login
    if (user.lockUntil && new Date(user.lockUntil).getTime() > Date.now()) {
      const msLeft = new Date(user.lockUntil).getTime() - Date.now();
      const secLeft = Math.ceil(msLeft / 1000);
      const min = Math.floor(secLeft / 60);
      const sec = secLeft % 60;

      return res.status(423).json({
        success: false,
        message: `Account locked. Try again in ${min}m ${sec}s`,
      });
    }

    // ✅ If lock expired -> reset lock and attempts
    if (user.lockUntil && new Date(user.lockUntil).getTime() <= Date.now()) {
      user.lockUntil = null;
      user.loginAttempts = 0;
      await user.save();
    }

    // ✅ Password check
    const isPasswordMatch = await bcrypt.compare(String(password || ""), user.password);

    // ❌ Wrong password -> increment attempts
    if (!isPasswordMatch) {
      user.loginAttempts = Number(user.loginAttempts || 0) + 1;

      // ✅ Lock after 10 attempts
      if (user.loginAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
        user.loginAttempts = 0; // optional reset after locking
        await user.save();

        return res.status(423).json({
          success: false,
          message: `Too many attempts. Account locked for ${LOCK_MINUTES} minutes.`,
        });
      }

      await user.save();

      return res.status(400).json({
        success: false,
        message: `Invalid credentials!`,
      });
    }

    // ✅ Success login -> reset attempts + lock
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // ✅ JWT token (store userId)
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ cookie set (same name everywhere)
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful!",
      user: {
        _id: user._id,
        email: user.email,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    //console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed!",
    });
  }
};

export default AuthLogin;