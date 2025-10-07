"use client";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

export default function MusicRow({ title, items, icon: Icon }) {
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
            {/* Album Art Placeholder  */}
            <div className="w-full aspect-square rounded-t-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
              <Music className="w-12 h-12 text-indigo-500 group-hover:scale-110 transition-transform" />
            </div>

            {/* Info */}
            <div className="p-4 text-center">
              <p className="text-slate-900 font-semibold group-hover:text-indigo-600 transition-colors">
                {item}
              </p>
              <p className="text-slate-500 text-sm mt-1">Artist Name</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
