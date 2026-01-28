import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import { useAdmin } from "../context/AdminContext";
import Alert from "../components/Alert";

const AdminAnnouncements = () => {
  const {
    announcements,
    announcementsLoading,
    fetchAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
    alert,
    showAlert,
  } = useAdmin();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // ✅ confirm delete modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements?.();
  }, []);

  const rows = useMemo(
    () => (Array.isArray(announcements) ? announcements : []),
    [announcements]
  );

  const resetModal = () => {
    setTitle("");
    setDescription("");
  };

  const closeModal = () => {
    setOpen(false);
    resetModal();
  };

  const openConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    if (deleteLoading) return;
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const t = title.trim();
    const d = description.trim();

    if (!t || !d) {
      showAlert("error", "Title & Description required");
      return;
    }

    const ok = await createAnnouncement({ title: t, description: d });
    if (ok) closeModal();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      const ok = await deleteAnnouncement(deleteId);
      if (!ok) showAlert("error", "Delete failed");
      closeConfirm();
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => showAlert({ isOpen: false, type: "", message: "" })}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto pt-24"
      >
        <div className="bg-black/50 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Announcements
              </h1>
              <p className="text-gray-400 mt-2">
                Create / manage announcements shown on user side.
              </p>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="h-12 px-5 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black
                       shadow-xl hover:shadow-yellow-500/40 active:scale-95 transition flex items-center gap-2"
            >
              <FaPlus />
              Add Announcement
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-yellow-500/20">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-black/70">
                  <tr className="text-left text-gray-200">
                    <th className="p-4 w-[240px]">Title</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 w-[160px]">Created</th>
                    <th className="p-4 w-[100px] text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="bg-black/30">
                  {announcementsLoading ? (
                    <tr>
                      <td className="p-6 text-gray-400" colSpan={4}>
                        Loading...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td className="p-6 text-gray-400" colSpan={4}>
                        No announcements yet.
                      </td>
                    </tr>
                  ) : (
                    rows.map((a) => (
                      <tr
                        key={a._id}
                        className="border-t border-yellow-500/10 text-gray-200"
                      >
                        <td className="p-4 font-semibold">{a.title}</td>
                        <td className="p-4 text-gray-300">
                          <div className="line-clamp-2">{a.description}</div>
                        </td>
                        <td className="p-4 text-gray-400">
                          {a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => openConfirm(a._id)}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl
                                     bg-red-600/20 border border-red-500/40 hover:bg-red-600/30
                                     transition active:scale-95"
                            title="Delete"
                          >
                            <FaTrash className="text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Modal */}
        {open && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-xl rounded-3xl bg-gradient-to-br from-gray-900 to-black
                       border border-yellow-500/25 shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-yellow-500/15">
                <h2 className="text-xl font-black text-white">Add Announcement</h2>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10
                           flex items-center justify-center transition"
                >
                  <FaTimes className="text-gray-300" />
                </button>
              </div>

              <form onSubmit={onSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-gray-300">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full h-12 rounded-2xl bg-black/40 border border-yellow-500/20
                             text-white px-4 outline-none focus:border-yellow-500/60"
                    placeholder="Announcement title"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-2xl bg-black/40 border border-yellow-500/20
                             text-white p-4 outline-none focus:border-yellow-500/60 resize-none"
                    placeholder="Write announcement details..."
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="h-12 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10
                             text-white font-semibold transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="h-12 px-6 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600
                             text-black font-black shadow-xl hover:shadow-yellow-500/40 active:scale-95 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ✅ Confirm Delete Modal */}
        {confirmOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md rounded-3xl bg-gradient-to-br from-gray-900 to-black
                         border border-red-500/30 shadow-2xl"
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-black text-white">Confirm Delete</h3>
                <p className="text-sm text-gray-400 mt-2">
                  Are you sure you want to delete this announcement? This action can’t be undone.
                </p>
              </div>

              <div className="p-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeConfirm}
                  disabled={deleteLoading}
                  className="h-11 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10
                             text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="h-11 px-5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700
                             text-white font-black shadow-xl hover:shadow-red-500/30 active:scale-95 transition
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AdminAnnouncements;