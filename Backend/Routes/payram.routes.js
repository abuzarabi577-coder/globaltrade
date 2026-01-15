import express from "express";
import {
  createInvestmentInvoice,
  webhookPayram,
  checkInvoiceStatus,
  getLatestInvoice,
} from "../controller/payram.controller.js";
// import { requireAuth } from "../middleware/requireAuth.js";
import authMiddleware from '../Midleware/authMiddleware.js';
import { getPayramTickers } from "../controller/fetchpyramticket.js";

const router = express.Router();

// user creates invoice for investment
router.post("/create-invoice", authMiddleware, createInvestmentInvoice);

// PayRam webhook hits here
router.post("/webhook", webhookPayram);

// optional: polling endpoint


router.get("/latest-invoice", authMiddleware, getLatestInvoice);
router.get("/invoice/:referenceId", authMiddleware, checkInvoiceStatus); // already
// router.get("/tickers", authMiddleware, getPayramTickers);
    
export default router;
