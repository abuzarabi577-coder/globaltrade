// Backend/Routes/tasksRoute.js
import express from 'express';
import { FetchUserData } from '../controller/FetchUserData.js';
import authMiddleware from '../Midleware/authMiddleware.js';
import fetchUserTasks from '../controller/FetchUserTaskController.js';
import completeDailyTasks from '../controller/taskcontroller.js';
import { checkDailyTasks } from '../controller/checkdailyTasksController.js';
import { activatePlanFromInvoice } from '../controller/InvestmentPlanSaveController.js';
import { createWithdrawRequest } from '../controller/withdraw.controller.js';
import { getMyWithdrawHistory } from '../controller/withdrawhistory.controller.js';
import { requestResetOtp } from '../controller/auth.forgot.controller.js';
import { checkUserWithdrawStatus } from '../controller/withdrawCheckBYUser.js';
import { getPublicTopRankers } from '../controller/publicleaderboard.js';
import { listAnnouncements } from '../Admincontroller/announcement.admin.controller.js';

const router = express.Router();

// ✅ Complete 5 Tasks
router.post('/complete-tasks',authMiddleware, completeDailyTasks);

// ✅ Check today's tasks
router.post('/check-sync',authMiddleware, checkDailyTasks);
// ✅ Fetch user  tasks
router.get('/fetch-tasks', fetchUserTasks);

// ✅ Fetch user  tasks
router.get('/fetch-user-data',authMiddleware, FetchUserData);
// ✅ Fetch user  tasks
router.post('/investment-plan',authMiddleware, activatePlanFromInvoice);
router.post('/withdraw/create',authMiddleware, createWithdrawRequest);
router.get('/withdraw/myhistory',authMiddleware, getMyWithdrawHistory);
router.get("/withdraw/check-status/:id", authMiddleware, checkUserWithdrawStatus);

router.get("/leaderboard/top", getPublicTopRankers);
router.get("/top-rankers", getPublicTopRankers);
router.get("/fetch-annocuments", listAnnouncements);

export default router;
