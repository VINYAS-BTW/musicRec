"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Music, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function MusicRow({ title, items, icon: Icon, onLike, onDislike }) {
  const scrollRef = useRef(null);

  const scrollBy = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-8 relative">
      {/* horizontal scrolls  erdu buttons*/}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-slate-100 cursor-pointer"
        onClick={() => scrollBy(-400)}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-slate-100 cursor-pointer"
        onClick={() => scrollBy(400)}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* hor row full divs */}
      <motion.div
        ref={scrollRef}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="flex overflow-x-auto gap-4 pb-4 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="min-w-[200px] cursor-pointer hover:shadow-2xl hover:translate-x-1 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all group flex-shrink-0"
          >
            {/* album galu */}
            <div className="w-full aspect-square rounded-t-xl overflow-hidden bg-slate-100 flex items-center justify-center relative">
              {item.imagelinks ? (
                <img
                  src={item.imagelinks}
                  alt={item.songName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <Music className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>

            {/* album info galu */}
            <div className="p-4">
              <p className="text-slate-900 font-semibold text-sm mb-1 line-clamp-2 ">
                {item.songName
                  ? item.songName
                  : typeof item === "string"
                  ? item
                  : "Untitled"}
              </p>
              {item.genre && (
                <p className="text-xs text-slate-500 mb-3">{item.genre}</p>
              )}
              
              {/* hu / huhu btns */}
              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-green-300 text-slate-700 rounded-lg transition-colors text-sm font-medium  cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike(item);
                  }}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Like</span>
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-red-300 text-slate-700 rounded-lg transition-colors text-sm font-medium cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDislike(item);
                  }}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Pass</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
