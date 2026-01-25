// src/Admin/TaskManage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaSearch, FaLink, FaSave } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

const TasksManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    points: '',
    description: '',
    category: 'watch',
    url: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const {
    saveAdminTasks,
    updateAdminTask,
    deleteAdminTask,
    HandleFetchAdminTasks,
    FetchAdminTasks
  } = useAppContext();

  useEffect(() => {
    HandleFetchAdminTasks();
  }, []);

  const filteredTasks = (FetchAdminTasks || []).filter(task =>
    task.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      name: task.name || '',
      points: task.points?.toString() || '',
      description: task.description || '',
      category: task.category || 'watch',
      url: task.url || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({
      name: '',
      points: '',
      description: '',
      category: 'watch',
      url: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.points) return;

    const payload = {
      ...formData,
      points: parseInt(formData.points)
    };

    if (editingTask) {
      await updateAdminTask(editingTask._id || editingTask.id, payload);
    } else {
      await saveAdminTasks(payload);
    }

    resetForm();
    HandleFetchAdminTasks();
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    await deleteAdminTask(taskToDelete._id || taskToDelete.id);
    setDeleteModalOpen(false);
    setTaskToDelete(null);
    HandleFetchAdminTasks();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto pt-16 px-4 space-y-6"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-yellow-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Tasks Manager
          </h1>
          <p className="text-sm text-gray-400">
            {FetchAdminTasks?.length || 0} tasks loaded
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold"
        >
          <FaPlus /> Add Task
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-yellow-500/30 text-white"
        />
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="block md:hidden space-y-4">
        {filteredTasks.map((task, i) => (
          <motion.div
            key={task._id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/70 border border-yellow-500/20 rounded-2xl p-4"
          >
            <div className="flex justify-between">
              <h3 className="text-white font-semibold text-sm">
                {task.name}
              </h3>
              <span className="text-xs font-bold text-yellow-400">
                {task.points} pts
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-2 line-clamp-2">
              {task.description || 'No description'}
            </p>

            <div className="flex justify-between items-center mt-3">
              <span className="text-xs uppercase bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">
                {task.category}
              </span>

              {task.url && (
                <a
                  href={task.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 flex items-center gap-1"
                >
                  <FaLink /> Link
                </a>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(task)}
                className="flex-1 py-2 bg-yellow-500/20 text-yellow-400 rounded-xl text-xs"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(task)}
                className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-xl text-xs"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-black/60 border border-yellow-500/20 rounded-2xl p-6">
        <table className="w-full text-xs table-fixed">
          <thead>
            <tr className="border-b border-yellow-500/30">
              <th className="text-left text-yellow-400 p-3">Task</th>
              <th className="text-center text-yellow-400">Points</th>
              <th className="text-left text-yellow-400">Category</th>
              <th className="text-left text-yellow-400">URL</th>
              <th className="text-left text-yellow-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, i) => (
              <tr key={task._id || i} className="border-b border-gray-800">
                <td className="p-3 text-white truncate">{task.name}</td>
                <td className="text-center text-yellow-400 font-bold">
                  {task.points}
                </td>
                <td className="text-blue-400">{task.category}</td>
                <td>
                  {task.url ? (
                    <a href={task.url} target="_blank" rel="noreferrer" className="text-blue-400">
                      View
                    </a>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="flex gap-2 p-2">
                  <button onClick={() => handleEdit(task)} className="text-yellow-400">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(task)} className="text-red-400">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODALS ================= */}
      {/* CREATE / EDIT */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]">
            <motion.form
              onSubmit={handleSubmit}
              className="bg-black border border-yellow-500/30 rounded-3xl p-8 w-full max-w-lg space-y-4"
            >
              <h2 className="text-xl text-center text-yellow-400 font-bold">
                {editingTask ? 'Edit Task' : 'Create Task'}
              </h2>

              <input
                required
                placeholder="Task name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/60 border border-yellow-500/40 text-white"
              />

              <input
                type="number"
                required
                placeholder="Points"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/60 border border-yellow-500/40 text-white"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/60 border border-yellow-500/40 text-white"
              />

              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/60 border border-yellow-500/40 text-white"
              >
                <option value="watch">Watch</option>
                <option value="subscribe">Subscribe</option>
                <option value="play">Play</option>
                <option value="share">Share</option>
              </select>

              <input
                placeholder="URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full p-3 rounded-xl bg-black/60 border border-yellow-500/40 text-white"
              />

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-yellow-500 text-black py-3 rounded-xl font-bold">
                  <FaSave /> Save
                </button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-700 text-white py-3 rounded-xl">
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1100]">
            <div className="bg-black border border-red-500/40 rounded-3xl p-6 w-full max-w-sm text-center">
              <p className="text-white mb-4">
                Delete <strong>{taskToDelete?.name}</strong>?
              </p>
              <div className="flex gap-3">
                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-2 rounded-xl">
                  Delete
                </button>
                <button onClick={() => setDeleteModalOpen(false)} className="flex-1 bg-gray-700 text-white py-2 rounded-xl">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TasksManager;
