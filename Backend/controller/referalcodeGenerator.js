import User from "../DBModels/UserProfile.js";

const generate8DigitCode = () => {
  // 10000000 - 99999999
  return String(Math.floor(10000000 + Math.random() * 90000000));
};

// ✅ Unique check with retries
export const generateUniqueReferralCode = async (maxTries = 10) => {
  for (let i = 0; i < maxTries; i++) {
    const code = generate8DigitCode();

    const exists = await User.exists({ referralCode: code });

    // ✅ agar kisi user ke paas ye code NAHI hai
    if (!exists) {
      return code; // yahin se naya unique code return
    }

    // ❌ agar exist karta hai → loop dobara chalega → naya code banega
  }

  // ❌ agar 10 attempts me bhi unique na mila
  throw new Error("Failed to generate unique referral code. Try again.");
};
