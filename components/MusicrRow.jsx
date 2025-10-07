"use client";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

export default function MusicRow({ title, items, icon: Icon, onLike, onDislike}) {
  return (
    <div className="mb-12 font-nunito">
      {/* Row Header */}
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-6 h-6 text-indigo-500" />
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>

      {/* Scrollable Row */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="flex overflow-x-auto gap-5 pb-4 scrollbar-hide"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="min-w-[180px] bg-white rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* Album Art or Placeholder */}
            <div className="w-full aspect-square rounded-t-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
              {item.imagelinks ? (
                <img
                  src={item.imagelinks}
                  alt={item.songName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-12 h-12 text-indigo-500 group-hover:scale-110 transition-transform" />
              )}
            </div>

            {/* Info */}
            <div className="p-4 text-center">
              <p className="text-slate-900 font-semibold group-hover:text-indigo-600 transition-colors">
                {item.songName
                  ? item.songName
                  : typeof item === "string"
                  ? item
                  : ""}
              </p>
              {item.genre && (
                <p className="text-xs text-slate-500 mt-1">{item.genre}</p>
              )}
              {/* You can add artist info if available */}
              {/* Like/Dislike Buttons */}
              <div className="flex justify-center gap-4 mt-2">
                <button
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  onClick={() => onLike(item)}
                >
                  👍 Like
                </button>
                <button
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  onClick={() => onDislike(item)}
                >
                  👎 Dislike
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/*<style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>*/}
    </div>
  );
}