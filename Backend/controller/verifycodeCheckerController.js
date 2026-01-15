import User from "../DBModels/UserProfile.js";




const VerifyCodeChecker=async (req,res)=>{
      try {
    const { userId, code } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ success: false, message: 'User not found!' });
    
    if (Date.now() > user.verificationCodeExpires) {
      return res.status(400).json({ success: false, message: 'Code expired!' });
    }
    
    if (user.verificationCode !== code) {
      return res.status(400).json({ success: false, message: 'Invalid code!' });
    }
    
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
   const verified= await user.save();
    if(verified){

      res.json({ success: true, message: 'Verified! Redirecting... please go to login' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export default VerifyCodeChecker