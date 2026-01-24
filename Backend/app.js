import express from 'express'
import connectDB from './DBModels/DB.js'
import AuthRoutes from './Routes/AuthRoutes.js'
// import AuthLogin from './Routes/Authlogin.js'
// import VerifyCodeSenderRoute from './Routes/verifyCodeSenderRoute.js'
// import VerifyCodeCheckerRoute from './Routes/verifycodecheckerroute.js'
import cors from 'cors';  
import cookieParser from 'cookie-parser';
import UserRoutes from './Routes/UserRoutes.js';
import payramsRoutes from './Routes/payram.routes.js';
import AdminTasksRoutes from './Routes/admintasksRoute.js';
import adminUsersRoutes from './Admincontroller/fetchadminUsersController.js';
import adminAuthRoutes from './Routes/AdminAuthRoutes.js';
import { startLeaderboardJob } from './Admincontroller/leaderboard.job.js';
import { syncPendingPayouts } from './cron/payoutChecker.js';
const app= express()
app.use(express.json());           // JSON data parse

// Connect to MongoDB
connectDB()

app.use(cookieParser());
const corsOptions = {
  origin: ["https://1cglobal.cc", "http://localhost:3000"],
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","x-user-tz"],
};

app.use(cors(corsOptions));

// ✅ IMPORTANT: preflight
app.options(/.*/, cors(corsOptions));
app.use(express.urlencoded({       // Form data parse
  extended: true 
}));
startLeaderboardJob();
// Har 5 minute (300,000 milliseconds) baad chalega
setInterval(() => { 
    console.log("Checking for pending payouts...");
    syncPendingPayouts();
}, 300000);
app.use('/api/auth',AuthRoutes)
app.use('/api/user', UserRoutes);
app.use('/api/admin', AdminTasksRoutes);
app.use("/api/admin", adminUsersRoutes);
// payram/create-invoice
app.use("/api/payram", payramsRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.get('/',(req,res)=>{
    res.send("server start")
})
const PORT = process.env.PORT || 5000; // Default port 5000

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    
})