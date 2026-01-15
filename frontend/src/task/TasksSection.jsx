import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { FaTelegramPlane, FaYoutube, FaShareAlt, FaGamepad } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import NoLoginForTasks from "./NoLoginForTasks";
import TaskCard from "./TaskCard";
import VideoModal from "./vediomadal";

const ICON_BY_CATEGORY = {
  watch: FaYoutube,
  subscribe: FaTelegramPlane,
  play: FaGamepad,
  share: FaShareAlt,
};

const TYPE_BY_CATEGORY = {
  watch: "watch",
  subscribe: "share",
  play: "game",
  share: "share",
};

const normalizeId = (v) => (v ? String(v) : "");

// ✅ backend/dayKey UTC (your DB uses YYYY-MM-DD)
const getDayKey = (d = new Date()) => d.toISOString().slice(0, 10);

export default function TasksSection() {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [taskIdsObj, setTaskIdsObj] = useState({});
  const videoTimerRef = useRef(null);

  const MAX_POINTS = 100;
  const TASK_POINTS = 20;
  const DAILY_TASKS = 5;
  const syncingRef = useRef(false);

  const {
    syncTasksToBackend,
    HandleFetchUserTasks,
    FetchUserTask,
    FetchUserData,
    HandleFetchUserData,
    showAlert,
  } = useAppContext();

  // ✅ login source = FetchUserData
  const isLoggedIn = !!FetchUserData?._id;
  const isPlanActive = !!FetchUserData?.isActivePlan;

  // ✅ DB based "today completed" check (always derive from latest FetchUserData)
  const todayKey = getDayKey();

  const groups = Array.isArray(FetchUserData?.dailyTasksCompleted)
    ? FetchUserData.dailyTasksCompleted
    : [];

  const todayGroup = groups.find((x) => String(x?.date) === String(todayKey));

  const getLocalDayKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // YYYY-MM-DD (LOCAL)
};

  // ✅ local restore (run once)
  useEffect(() => {
    const tk = getDayKey();
    const savedDate = localStorage.getItem("tasksDate");
    const savedObj = localStorage.getItem("taskIdsObj");
    const savedPoints = localStorage.getItem("totalPoints");

    // ✅ new day => clear local
    if (savedDate !== tk) {
      localStorage.setItem("tasksDate", tk);
      localStorage.removeItem("taskIdsObj");
      localStorage.removeItem("totalPoints");
      setTaskIdsObj({});
      setCompletedTasks([]);
      setTotalPoints(0);
      return;
    }

    // ✅ same day => restore local
    if (savedObj) {
      try {
        const obj = JSON.parse(savedObj) || {};
        setTaskIdsObj(obj);
        const ids = Object.keys(obj);
        setCompletedTasks(ids.map((id) => ({ id })));
        setTotalPoints(
          savedPoints ? Number(savedPoints) : Math.min(ids.length * TASK_POINTS, MAX_POINTS)
        );
      } catch {
        // ignore bad json
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ always fetch user on mount
  useEffect(() => {
    HandleFetchUserData();
  }, [HandleFetchUserData]);

  // ✅ fetch tasks list when logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    HandleFetchUserTasks();
  }, [HandleFetchUserTasks, isLoggedIn]);

  // ✅ DB -> set today's completed (SOURCE OF TRUTH)
 useEffect(() => {
  if (!isLoggedIn) return;
  if (!FetchUserData?._id) return;

  const groups = Array.isArray(FetchUserData?.dailyTasksCompleted)
    ? FetchUserData.dailyTasksCompleted
    : [];

  const tg = groups.find((x) => String(x?.date) === String(todayKey));
  if (!tg) return;

  const ids = Array.isArray(tg?.taskIds) ? tg.taskIds.map(normalizeId) : [];
  const obj = {};
  ids.forEach((id) => (obj[id] = true));

  setTaskIdsObj(obj);
  setCompletedTasks(ids.map((id) => ({ id })));
  setTotalPoints(Math.min(ids.length * TASK_POINTS, MAX_POINTS));

  localStorage.setItem("tasksDate", todayKey);
  localStorage.setItem("taskIdsObj", JSON.stringify(obj));
  localStorage.setItem("totalPoints", String(Math.min(ids.length * TASK_POINTS, MAX_POINTS)));
}, [isLoggedIn, FetchUserData?._id, FetchUserData?.dailyTasksCompleted, todayKey]);

  // ✅ Completed check
  const isTaskCompleted = (taskId) => {
    const id = normalizeId(taskId);
    return !!taskIdsObj[id];
  };

  // ✅ daily tasks list
  const dailyTasks = useMemo(() => {
    const tasks = Array.isArray(FetchUserTask) ? FetchUserTask : [];

    return tasks.slice(0, DAILY_TASKS).map((t) => {
      const category = (t.category || "").toLowerCase();
      const Icon = ICON_BY_CATEGORY[category] || FaShareAlt;
      const id = normalizeId(t._id || t.id);

      const completed = isTaskCompleted(id);

      return {
        ...t,
        id,
        title: t.name || "Task",
        reward: t.points ?? TASK_POINTS,
        type: TYPE_BY_CATEGORY[category] || "share",
        icon: Icon,
        status: completed ? "completed" : "pending",
      };
    });
  }, [FetchUserTask, taskIdsObj]);

  if (!isLoggedIn) return <NoLoginForTasks />;

  const handleTaskComplete = async (task) => {
    const id = normalizeId(task.id);
    if (isTaskCompleted(id)) return;

    const newObj = { ...taskIdsObj, [id]: true };
    const ids = Object.keys(newObj);

    setTaskIdsObj(newObj);
    setCompletedTasks(ids.map((x) => ({ id: x })));
    setTotalPoints(Math.min(ids.length * TASK_POINTS, MAX_POINTS));

    // remember (local)
    localStorage.setItem("tasksDate", getDayKey());
    localStorage.setItem("taskIdsObj", JSON.stringify(newObj));
    localStorage.setItem("totalPoints", String(Math.min(ids.length * TASK_POINTS, MAX_POINTS)));

    // ✅ Auto sync exactly when 5 done
    if (ids.length === 5 && !syncingRef.current) {
      syncingRef.current = true;
      try {
        const ok = await syncTasksToBackend(ids);

        if (ok) {
          // ✅ local clear after successful sync
          localStorage.removeItem("taskIdsObj");
          localStorage.removeItem("totalPoints");

          // ✅ refresh DB and let DB effect set state
          await HandleFetchUserData();
        }
      } finally {
        syncingRef.current = false;
      }
    }
  };

  const handleStartTask = (task) => {
    if (!isPlanActive) {
      showAlert("error", "Please activate a plan first!");
      navigate("/plans");
      return;
    }
    if (isTaskCompleted(task.id)) return;

    if (task.type === "watch") {
      setVideoUrl(task.url);

      if (videoTimerRef.current) clearTimeout(videoTimerRef.current);

      videoTimerRef.current = setTimeout(() => {
        handleTaskComplete(task);
        setVideoUrl(null);
      }, 10000);
    } else if (task.type === "game") {
      navigate(task.url);
      handleTaskComplete(task);
    } else {
      window.open(task.url, "_blank", "noopener,noreferrer");
      handleTaskComplete(task);
    }
  };
// ✅ STRICT: DB says today completed => 100% (no state dependency)
const todayLocal = getLocalDayKey();
const savedDate = localStorage.getItem("tasksDate");

// ✅ agar aaj ki date match karti hai tab hi progress
const isToday = savedDate === todayLocal;

const completedCount = isToday
  ? Math.min(Object.keys(taskIdsObj).length, DAILY_TASKS)
  : 0;

const progressPercent = isToday
  ? Math.min((completedCount / DAILY_TASKS) * 100, 100)
  : 0;

const pointsToShow = isToday
  ? Math.min(completedCount * TASK_POINTS, MAX_POINTS)
  : 0;

  return (
    <div className="min-h-screen w-full mt-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative">
      <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-28 space-y-10">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Daily Tasks
          </h1>
        </motion.div>

        <div className="bg-black/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/60">
          <div className="text-sm text-gray-400 mb-3 flex justify-between">
            <span>Daily Progress</span>
            <span>
              {pointsToShow}/{MAX_POINTS} points
            </span>
          </div>

          <div className="w-full bg-gray-900 rounded-2xl h-3 overflow-hidden">
            <motion.div
              className="h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="text-xs text-gray-500 mt-2 flex justify-between">
            <span>{Math.round(progressPercent)}% Complete</span>
            <span>
              {completedCount}/{DAILY_TASKS} Tasks
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dailyTasks.map((task) => (
            <TaskCard key={task.id} task={task} onStart={handleStartTask} />
          ))}
        </div>
      </div>

      <VideoModal videoUrl={videoUrl} onClose={() => setVideoUrl(null)} />
    </div>
  );
}
