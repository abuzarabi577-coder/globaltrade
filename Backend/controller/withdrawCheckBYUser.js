import WithdrawRequest from "../DBModels/WithdrawRequest.js";
import User from "../DBModels/UserProfile.js";
import { getPayramWithdrawalStatus } from "../services/payramPayout.service.js";

// /var/www/globaltrade/Backend/controllers/withdraw.controller.js

export async function checkUserWithdrawStatus(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const wr = await WithdrawRequest.findOne({ _id: id, userId: userId });
    
    if (!wr) return res.status(404).json({ success: false, message: "Request not found" });

    // ✅ FIX: Agar PayRam ID nahi hai, to status reset karein taaki admin panel mein wapas show ho sake
    if (!wr.payramPayoutId) {
       // Agar ID nahi hai, iska matlab hai pichli dafa PayRam ne request accept nahi ki thi
       return res.status(400).json({ 
         success: false, 
         message: "Payout failed to initiate. Please contact support or wait for admin." 
       });
    }

    const actualStatusResponse = await getPayramWithdrawalStatus(wr.payramPayoutId);
    
    // PayRam kabhi kabhi status "success" bhejta hai, usey hamare "processed" se match karein
    const newStatus = actualStatusResponse.status === 'success' ? 'processed' : actualStatusResponse.status;

    if (newStatus !== wr.status) {
      // Database update logic inside if (newStatus !== wr.status)
if (newStatus === "processed") {
    const user = await User.findById(userId);
    if (user && wr.status !== "processed") {
        // Ensure amount is valid number
        const amountToDeduct = Number(wr.amount) || 0;
        const amountUSD = Number(wr.amountUSD) || 0;

        user.totalEarnings -= amountToDeduct;
        user.WithdrwalAmt = (Number(user.WithdrwalAmt) || 0) + amountUSD;
        
        await user.save();
        console.log(`✅ Balance updated for user ${userId}`);
    }
}

      wr.status = newStatus;
      wr.payramSnapshot = actualStatusResponse;
      await wr.save();
    }

    return res.json({ 
      success: true, 
      status: wr.status, 
      message: `Status updated to ${wr.status}` 
    });

  } catch (e) {
    // Agar PayRam API abhi bhi timeout de rahi hai
    return res.status(500).json({ success: false, message: "withdraw request connection timeout. Try again later." });
  }
}