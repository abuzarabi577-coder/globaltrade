import WithdrawRequest from "../DBModels/WithdrawRequest.js";
import User from "../DBModels/UserProfile.js"; // User model lazmi import karein
import { getPayramWithdrawalStatus } from "../services/payramPayout.service.js";

export async function syncPendingPayouts() {
  const pendingRequests = await WithdrawRequest.find({
    status: { $in: ["pending", "initiated", "pending-approval"] },
    payramPayoutId: { $ne: null }
  });

  for (const wr of pendingRequests) {
    try {
      const actualStatusResponse = await getPayramWithdrawalStatus(wr.payramPayoutId);
      const newStatus = actualStatusResponse.status;

      if (newStatus !== wr.status) {
        // ✅ AGAR STATUS "PROCESSED" HO GAYA HAI
        if (newStatus === "processed") {
          const user = await User.findById(wr.userId);
          if (user) {
            const amount = Number(wr.amountUSD);
            
            // Balance minus karein aur total withdrawal mein jama karein
            user.totalEarnings -= amount; 
            user.WithdrwalAmt = (Number(user.WithdrwalAmt) || 0) + amount;
            
            await user.save();
            // console.log(`✅ Balance deducted for User: ${user.email} - Amount: ${amount}`);
          }
        }

        // Status update karein database mein
        wr.status = newStatus;
        wr.payramSnapshot = actualStatusResponse;
        await wr.save();
        
        // console.log(`🔄 Updated ID ${wr.payramPayoutId} to ${newStatus}`);
      }
    } catch (err) {
      console.error(`❌ Sync fail for ID ${wr.payramPayoutId}:`, err.message);
    }
  }
}