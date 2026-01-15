// controller/RegisterUserController.js
import User from "../DBModels/UserProfile.js";
import bcrypt from "bcryptjs";
import { buildReferralChain } from "../ReferralSystem/buildReferralChain.js";
import { updateUplineLevelsByDepth } from "../ReferralSystem/updateUplineLevels.js";
import { addReferralEntry } from "../ReferralSystem/addReferralEntry.js";

const RegesterUserController = async (req, res) => {
  try {
    const { name, email, password, walletAddress, network, ReferralCode } = req.body;

    // basic checks
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ success: false, message: "Email already exists!" });

    const existingName = await User.findOne({ name });
    if (existingName) return res.status(400).json({ success: false, message: "Name already registered!" });

    const hashedPassword = await bcrypt.hash(password, 12);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      walletAddress,
      network,
      referralCode: "TEMP",
      level: 0,
    });

    // set referralCode = last 8 of _id
    user.referralCode = user._id.toString().slice(-8);
    await user.save();

    // optional referral
    const code = String(ReferralCode || '').trim();
    if (code) {
      const chain = await buildReferralChain({
        newUserId: user._id,
       ReferralCode
      });

      if (!chain.ok) {
        // OPTIONAL rollback user (recommended)
        await User.deleteOne({ _id: user._id });
        return res.status(400).json({ success: false, message: chain.message || "Invalid referral code" });
      }

      if (chain.directReferrerId) {
        await updateUplineLevelsByDepth({ directReferrerId: chain.directReferrerId });
        await addReferralEntry({ referralCode: code, newUserId: user._id });
      }
    }

    return res.json({
      success: true,
      message: "Account created!",
      _id: user._id,
      referralCode: user.referralCode,
    });
  } catch (error) {
    //console.error("Registration error:", error);
    return res.status(400).json({ success: false, message: "Registration failed!" });
  }
};

export default RegesterUserController;
