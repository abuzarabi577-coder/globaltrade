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
const app= express()
app.use(express.json());           // JSON data parse

// Connect to MongoDB
connectDB()

app.use(cookieParser());
app.use(cors({
  origin: 'https://1cglobal.ch', // Frontend URL
  credentials: true // ✅ Cookies allow
}));
app.use(express.urlencoded({       // Form data parse
  extended: true 
}));
startLeaderboardJob();

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