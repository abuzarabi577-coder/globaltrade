import User from "../DBModels/UserProfile.js";
import bcrypt from "bcryptjs";

export const adminCreateUser = async (req, res) => {
  try {
    const { name, email, password, level, totalEarnings, walletAddress, network } = req.body;

    // minimal validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "name, email, password required" });
    }

    // IMPORTANT: your schema has required referralCode (generate it here if needed)
    // If referralCode required hai to yahan generate karna lazmi hai warna 500/400 aayega.
    const referralCode = `DUM${Date.now().toString().slice(-8)}`;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: String(email).toLowerCase(),
      password : hashedPassword,
      level: Number(level || 0),
      totalEarnings: Number(totalEarnings || 0),

      walletAddress: walletAddress || "dumyuserwallet",
      network: network || "ETH",
      referralCode,
    });

    return res.json({ success: true, user });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
