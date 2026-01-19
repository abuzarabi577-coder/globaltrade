import jwt from "jsonwebtoken";
import User from "../DBModels/UserProfile.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken; // ✅ SAME cookie name
    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

const decoded = jwt.verify(token, process.env.JWT_SECRET);
 const user = await User.findById(decoded.userId).select(
      "_id name email walletAddress  network totalEarnings WithdrwalAmt TotalPoints Referal referralCode dailyTasksCompleted  isActivePlan activePlan  earnings isActive Join level"
    ).populate("Referal.userId", "name level earnings ");;   
     if (!user) {
      return res.status(401).json({ success: false, message: "Invalid user" });
    }

    req.user = user;
      req.userId = user._id; 
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authMiddleware;
