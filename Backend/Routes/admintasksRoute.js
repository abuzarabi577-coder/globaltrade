// routes/auth.js
import express from 'express';
import fetchAdminTasks from '../controller/FetchAdminTasksController.js';
import { updateTask } from '../controller/updateTasksController.js';
import SaveTasks  from '../controller/TaskSaveController.js';
import deleteTask  from '../controller/deleteTasksController.js';
import { adminRecalculateLeaderboard, getLeaderboard } from '../Admincontroller/leaderboard.js';
import { adminApproveWithdraw, adminFetchWithdraws, adminRejectWithdraw } from '../Admincontroller/admin.withdraw.controller.js';
// import { adminGetUsers } from '../Admincontroller/fetchadminUsersController.js';
import authMiddleware from '../Midleware/authMiddleware.js';
import { adminCreateUser } from '../Admincontroller/createDummyUSer.js';
import { toggleUserStatus } from '../Admincontroller/userStatusController.js';
import { listAnnouncements,deleteAnnouncement,createAnnouncement } from '../Admincontroller/announcement.admin.controller.js';

const router = express.Router();









router.get('/fetch-tasks',fetchAdminTasks);
router.put('/update-task/:id',updateTask);
router.post('/savetasks', SaveTasks);
router.delete('/delete-task/:id', deleteTask);
router.get("/leaders", getLeaderboard);

// admin can force recalc
router.post("/recalculate",  adminRecalculateLeaderboard);

router.get("/withdraws", adminFetchWithdraws);
router.post("/withdraws/:id/approve", adminApproveWithdraw);
router.post("/withdraws/:id/reject", adminRejectWithdraw);


router.post("/dummyusers/create", adminCreateUser);

router.patch("/users/:id/toggle-status", toggleUserStatus);
// GET /api/admin/users?q=&page=&limit=
// router.get("/users", adminGetUsers);
router.get("/", listAnnouncements);
router.post("/", createAnnouncement);
router.delete("/:id", deleteAnnouncement);
export default router;