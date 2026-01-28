import mongoose from "mongoose";
import Announcement from "../DBModels/Announcement.js";

export const listAnnouncements = async (req, res) => {
  try {
    const list = await Announcement.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, list });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;

    const t = String(title || "").trim();
    const d = String(description || "").trim();

    if (!t || !d) {
      return res.status(400).json({ success: false, message: "Title & description required" });
    }

    const doc = await Announcement.create({ title: t, description: d });
    return res.json({ success: true, announcement: doc });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    return res.json({ success: true, message: "Deleted" });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};