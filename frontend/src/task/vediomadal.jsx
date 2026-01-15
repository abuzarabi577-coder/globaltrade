import React, { useMemo } from "react";
import { motion } from "framer-motion";

function toYouTubeEmbed(url) {
  if (!url) return "";

  try {
    const u = new URL(url);

    // youtu.be/VIDEO_ID
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    // youtube.com/watch?v=VIDEO_ID
    if (u.hostname.includes("youtube.com")) {
      // shorts
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/shorts/")[1]?.split(/[?&/]/)[0];
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }

      // embed already
      if (u.pathname.startsWith("/embed/")) return url;

      // normal watch
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }

    return url; // other platforms
  } catch {
    return url;
  }
}

export default function VideoModal({ videoUrl, onClose }) {
  const embedUrl = useMemo(() => toYouTubeEmbed(videoUrl), [videoUrl]);

  if (!videoUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] aspect-video bg-black rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-3xl"
          title="Task Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        <motion.button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-3xl flex items-center justify-center shadow-2xl border-4 border-black"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ✕
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
