// src/Admin/TaskManage.jsx - ✅ UPDATE vs CREATE SEPARATE ✅ TABLE FIXED
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaSearch, FaLink, FaSave } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

const TasksManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ name: '', points: '', description: '', category: '', url: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [taskToDelete, setTaskToDelete] = useState(null);

  const { saveAdminTasks, updateAdminTask,   deleteAdminTask
,HandleFetchAdminTasks, FetchAdminTasks } = useAppContext();

  // ✅ FILTER DATA
  const filteredTasks = (FetchAdminTasks || []).filter(task =>
    task.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    HandleFetchAdminTasks();
  }, []);

  // ✅ HANDLE EDIT
  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      name: task.name || '',
      points: task.points?.toString() || '',
      description: task.description || '',
      category: task.category || '',
      url: task.url || ''
    });
    setIsModalOpen(true);
  };

  // ✅ HANDLE DELETE
  const handleDelete = (task) => {
  setTaskToDelete(task);
  setDeleteModalOpen(true);
};


  // ✅ HANDLE SUBMIT - CREATE vs UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.points) return;

    const taskData = {
      ...formData,
      points: parseInt(formData.points),
    };

    try {
      if (editingTask) {
        // ✅ UPDATE EXISTING TASK
        await updateAdminTask(editingTask._id || editingTask.id, taskData);
      } else {
        // ✅ CREATE NEW TASK
        await saveAdminTasks(taskData);
      }
      
      resetForm();
      await HandleFetchAdminTasks(); // Refresh list
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({ name: '', points: '', description: '', category: '', url: '' });
  };
const confirmDelete = async () => {
  if (!taskToDelete) return;

  const success = await deleteAdminTask(taskToDelete._id || taskToDelete.id);
  if (success) {
    setDeleteModalOpen(false);
    setTaskToDelete(null);
    await HandleFetchAdminTasks();
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pt-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-yellow-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Tasks Manager
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {FetchAdminTasks?.length || 0} tasks loaded
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Add Task
        </motion.button>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-yellow-500/30 rounded-xl text-white placeholder-gray-400 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
            />
          </div>
        </div>
        
      </div>

      {/* FIXED TABLE - No gaps */}
      <div className="bg-black/60 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs  table-fixed">
            <thead>
              <tr className="border-b-2 border-yellow-500/30">
                <th className="w-2/5 py-3 pl-4 pr-2 text-left font-semibold text-yellow-400 uppercase tracking-wider text-xs">Task Name</th>
                <th className="w-1/10 py-3 px-2 text-center font-semibold text-yellow-400 uppercase tracking-wider text-xs">Points</th>
                <th className="w-1/6 py-3 px-2 text-left font-semibold text-yellow-400 uppercase tracking-wider text-xs">Category</th>
                <th className="w-1/5 py-3 px-2 text-left font-semibold text-yellow-400 uppercase tracking-wider text-xs">URL</th>
                <th className="w-1/8 py-3 px-2 text-left font-semibold text-yellow-400 uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.tr
                    key={task._id || task.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="hover:bg-yellow-500/5 transition-all h-14 border border-gray-800/30"
                  >
                    <td className="py-3 pl-4 pr-2 font-medium text-white truncate max-w-[280px]" title={task.name}>
                      {task.name}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/40 rounded-lg font-bold text-xs inline-block min-w-[60px]">
                        {task.points} pts
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/40 rounded-lg font-semibold text-xs uppercase tracking-wide inline-block min-w-[80px]">
                        {task.category?.charAt(0).toUpperCase() + task.category?.slice(1) || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-2 max-w-[140px]">
                      {task.url ? (
                        <a 
                          href={task.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-xs font-medium truncate  hover:underline flex items-center gap-1"
                          title={task.url}
                        >
                          <FaLink className="w-3 h-3 flex-shrink-0" />
                          View Link
                        </a>
                      ) : (
                        <span className="text-gray-500 text-xs">No URL</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
onClick={() => handleEdit(task)}
                          className="p-1.5 bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/40 rounded-lg text-yellow-400 hover:text-yellow-200 shadow-md hover:shadow-lg transition-all flex items-center justify-center flex-1 min-w-[32px]"
                          title="Edit Task"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleDelete(task )}
                          className="p-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 rounded-lg text-red-400 hover:text-red-200 shadow-md hover:shadow-lg transition-all flex items-center justify-center flex-1 min-w-[32px]"
                          title="Delete Task"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <div className="text-gray-500 space-y-2">
                        <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center mx-auto">
                          <FaSearch className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium">
                          {searchTerm ? `No tasks found for "${searchTerm}"` : 'No tasks available'}
                        </p>
                        <p className="text-xs opacity-75">Try adjusting search or add new tasks</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[1000] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-black/95 backdrop-blur-3xl border border-yellow-500/30 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-8 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent text-center">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-yellow-400 mb-2">Task Name *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-4 bg-black/60 border-2 border-yellow-500/40 rounded-2xl text-white text-sm placeholder-gray-400 focus:border-yellow-500/70 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                      placeholder="e.g. Watch Investment Tutorial"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-yellow-400 mb-2">Points *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="20"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                      className="w-full p-4 bg-black/60 border-2 border-yellow-500/40 rounded-2xl text-white text-sm placeholder-gray-400 focus:border-yellow-500/70 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                      placeholder="20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-yellow-400 mb-2">Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 bg-black/60 border-2 border-yellow-500/40 rounded-2xl text-white text-sm placeholder-gray-400 focus:border-yellow-500/70 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 resize-vertical"
                    placeholder="Brief description..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-yellow-400 mb-2">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-4 bg-black/60 border-2 border-yellow-500/40 rounded-2xl text-white text-sm focus:border-yellow-500/70 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                    >
                      <option value="watch">Watch Video</option>
                      <option value="subscribe">Subscribe</option>
                      <option value="play">Play Game</option>
                      <option value="share">Share App</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-yellow-400 mb-2">URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full p-4 bg-black/60 border-2 border-yellow-500/40 rounded-2xl text-white text-sm placeholder-gray-400 focus:border-yellow-500/70 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-yellow-500/50 hover:-translate-y-0.5 transition-all text-lg flex items-center justify-center gap-2"
                  >
                    <FaSave className="w-5 h-5" />
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    whileHover={{ scale: 1.02 }}
                    className="px-8 py-4 bg-gray-700/80 hover:bg-gray-600 text-white font-semibold rounded-2xl border border-gray-600 hover:border-gray-500 transition-all shadow-lg hover:shadow-xl"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
  {deleteModalOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[1100] flex items-center justify-center p-4"
      onClick={(e) =>
        e.target === e.currentTarget && setDeleteModalOpen(false)
      }
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-black/95 border border-red-500/40 rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-xl font-bold text-red-400 text-center mb-4">
          Confirm Delete
        </h3>

        <p className="text-gray-300 text-sm text-center mb-6">
          Are you sure you want to permanently delete
          <span className="block mt-2 text-white font-semibold">
            “{taskToDelete?.name}”
          </span>
        </p>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={confirmDelete}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 rounded-2xl shadow-lg"
          >
            Yes, Delete
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setDeleteModalOpen(false)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-2xl border border-gray-600"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </motion.div>
  );
};

export default TasksManager;
