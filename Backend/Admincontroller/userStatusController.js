// Admincontroller/userStatusController.js

import User from "../DBModels/UserProfile.js";

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body; // Frontend se updated status aayega

    // 1. User ko find aur update karein
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: isActive },
      { new: true } // Updated document return karne ke liye
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "Activated" : "Suspended"} successfully`,
      user: {
        id: user._id,
        isActive: user.isActive,
        name: user.name
      },
    });
  } catch (error) {
    console.error("Status Toggle Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};