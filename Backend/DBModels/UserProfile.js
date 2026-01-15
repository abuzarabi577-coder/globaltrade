  // models/User.js
  import mongoose from 'mongoose';

const referralEntrySchema = new mongoose.Schema(
  {
    userNumber: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const profitCreditSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // dayKey
    amount: { type: Number, required: true },
    roiPct: { type: Number, required: true },
  },
  { _id: false }
);

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  dailyROIPct: { type: Number, required: true },
  totalProfit: { type: Number, default: 0 },
  credits: { type: [profitCreditSchema], default: [] },
  isClosed: { type: Boolean, default: false },
  closedAt: { type: Date, default: null },

  referenceId: { type: String, default: "" },
  network: { type: String, default: "" },
  asset: { type: String, default: "USDT" },
}, { _id: false });


const activePlanEntrySchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    plan: { type: planSchema, required: true },
  },
  { _id: true  }
);




  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'First name is required']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8
    },


resetOtp: { type: String, default: null },
resetOtpExpires: { type: Date, default: null },


resetToken: { type: String, default: null },
resetTokenExpires: { type: Date, default: null },
    verificationCode: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCodeExpires: {
    type: Date,
    default: null
  },
    walletAddress: {
      type: String,
      required: [true, 'Wallet address is required'],
    },
  dailyTasksCompleted: [
    {
      date: { type: String, required: true }, // YYYY-MM-DD
      taskIds: [{ type: String, required: true }]
    }
  ],
  TotalPoints:{
    type:Number,default:'0'
  },


    transactions: [],
    network: {
      type: String,
    
    },
    totalEarnings: {
      type: Number,
      default: 0
    },

WithdrwalAmt:String,
    // ✅ referral
referralCode: { type: String, required: true, unique: true, index: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    referredByCode: { type: String, default: null },

    // ✅ your dynamic level system (0..10)
    level: { type: Number, default: 0, min: 0, max: 10 },

    Referal: { type: [referralEntrySchema], default: [] },


    // ✅ IMPORTANT: your current active plan data here
  activePlan: { type: [activePlanEntrySchema], default: [] },
    // ✅ earnings breakdown + grand total
    earnings: {
      roi: { type: Number, default: 0 },
      teamProfitShare: { type: Number, default: 0 },
      referralCommission: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
isActivePlan: {
      type: Boolean,
      default: false
    },
Freeze: {
      type: Boolean,
      default: false
    },

rank: {
  title: { type: String, enum: ["PLATINUM", "GOLD", "SILVER", "BRONZE"], default: "BRONZE" },
  score: { type: Number, default: 0 },     // computed score (optional but useful)
  position: { type: Number, default: 0 },  // leaderboard position
  updatedAt: { type: Date, default: null }
},
loginAttempts: { type: Number, default: 0 },
lockUntil: { type: Date, default: null },

Iswithdraw:{
      type: Boolean,
      default: true
    },
startTotalEarnings: { type: Number, default: 0 },  // ✅ snapshot at activation
multiplierAtStart: { type: Number, default: 3 },  // optional (debug/audit)

    isActive: {
      type: Boolean,
      default: true
    },
    Join:{
      type:Date,
    default: Date.now()
    }
  },
  {
    timestamps: true
  });



  const User = mongoose.model('User', userSchema);
  export default User;