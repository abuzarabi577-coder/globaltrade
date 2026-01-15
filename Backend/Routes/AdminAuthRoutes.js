import express from "express";
import { adminLogin, adminLogout, adminMe, DefaultCreateAdmin } from '../Admincontroller/adminAuth.controller.js';
import { updateAdminCredentials } from "../Admincontroller/updateAdmin.js";

const router = express.Router();

router.get("/createadminprofile", DefaultCreateAdmin);

// ✅ login/logout/me
router.post("/login", adminLogin);
router.get("/me", adminMe);
router.post("/logout", adminLogout);
router.put("/update-admin", updateAdminCredentials);

export default router;
